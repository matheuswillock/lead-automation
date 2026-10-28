import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { whatsappUrl } from "./whatsappUrl"

test("WhatsApp URL uses selected country for local numbers and preserves explicit international numbers", () => {
  assert.equal(whatsappUrl("020 7946 0958", "gb"), "https://wa.me/442079460958")
  assert.equal(whatsappUrl("+1 (212) 555-0100", "br"), "https://wa.me/12125550100")
})

test("WhatsApp URL supports local numbers from countries offered by the country picker", () => {
  assert.equal(whatsappUrl("020 1234 5678", "nl"), "https://wa.me/312012345678")
  assert.equal(whatsappUrl("044 668 18 00", "ch"), "https://wa.me/41446681800")
  assert.equal(whatsappUrl("0033 1 42 68 53 00", "nl"), "https://wa.me/33142685300")
})

test("WhatsApp URL uses the expected E.164 calling code for selected countries", () => {
  const cases = [
    ["aq", "672", "12345678"],
    ["gs", "500", "12345678"],
    ["tk", "690", "12345678"],
    ["gb", "44", "020 7946 0958"],
    ["nl", "31", "020 1234 5678"],
    ["ch", "41", "044 668 18 00"],
    ["br", "55", "11 98765-4321"],
    ["de", "49", "030 12345678"],
    ["jp", "81", "03 1234 5678"],
    ["in", "91", "098765 43210"],
  ] as const

  for (const [country, callingCode, phone] of cases) {
    const nationalNumber = phone.replace(/\D/g, "").replace(/^0+/, "")
    assert.equal(whatsappUrl(phone, country), `https://wa.me/${callingCode}${nationalNumber}`, country)
  }
})

test("every country code offered by the picker has a calling code", () => {
  const picker = readFileSync("src/components/ui/country-picker.tsx", "utf8")
  const list = picker.match(/const COUNTRY_CODES = `([^`]+)`/)?.[1]
  assert.ok(list, "country picker country-code list should be readable")
  const countries = list!.split(/\s+/)
  for (const country of countries) {
    assert.ok(whatsappUrl("12345678", country), `missing calling code for country picker entry ${country}`)
  }
})

test("WhatsApp URL is disabled for missing or unsupported country and invalid numbers", () => {
  assert.equal(whatsappUrl("11987654321", undefined), null)
  assert.equal(whatsappUrl("123456789", "zz"), null)
  assert.equal(whatsappUrl("12", "br"), null)
})
