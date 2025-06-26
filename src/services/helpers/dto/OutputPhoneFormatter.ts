export class OutputPhoneFormatter {
  formatted: string;
  whatsappLink: string;

  constructor(formatted: string | null, whatsappLink: string | null) {
    this.formatted = formatted ?? "";
    this.whatsappLink = whatsappLink ?? "";
  }
}