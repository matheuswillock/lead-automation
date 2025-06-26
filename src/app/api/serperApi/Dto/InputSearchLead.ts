import { InputSerper } from "@/services/SerperService/Serper";

export default class InputSearchLead {
  q: string;
  location: string;
  gl: string;
  hl: string;
  page: number;

  constructor(
    q: string,
    location: string,
    gl: string = "br",
    hl: string = "pt",
    page: number = 1
  ) {
    this.q = q;
    this.location = location;
    this.gl = gl;
    this.hl = hl;
    this.page = page;
  }

  static fromSearchLead(input: InputSerper): InputSearchLead {
    return new InputSearchLead(
      input.query,
      input.location,
      input.country || "br",
      input.language || "pt-br",
      input.page || 1,
    );
  }
}