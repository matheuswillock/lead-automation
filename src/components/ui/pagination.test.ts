import assert from "node:assert/strict"
import test from "node:test"

import { buildPaginationItems } from "./pagination"

test("pagination keeps boundaries and inserts ellipses around the active page", () => {
  assert.deepEqual(buildPaginationItems(10, 20, 1), [1, "ellipsis", 9, 10, 11, "ellipsis", 20])
})

test("pagination renders every page when the range is short", () => {
  assert.deepEqual(buildPaginationItems(3, 5, 1), [1, 2, 3, 4, 5])
})
