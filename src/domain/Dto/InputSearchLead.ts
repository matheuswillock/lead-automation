import { InputSerper } from "@/services/SerperService/Serper";

export default class InputSearchLead {
  q: string;
  location?: string;
  gl: string;
  hl: string;
  page: number;

  constructor(
    q: string,
    location: string | undefined,
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
    const location = input.location?.trim();

    // O `location` do Serper só vale no nome canônico do Google ("Jundiai,State of Sao Paulo,Brazil");
    // texto livre é ignorado e devolve resultados do país todo. A cidade vai no `q`, que foi validado.
    return new InputSearchLead(
      location ? `${input.query} ${location}` : input.query,
      undefined,
      input.country || "br",
      input.language || "pt-br",
      Number.isInteger(input.page) && input.page > 0 ? input.page : 1,
    );
  }
}
