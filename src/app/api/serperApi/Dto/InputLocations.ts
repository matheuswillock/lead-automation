export class InputLocations {
  query?: string;
  limit?: number;

  constructor(query?: string, limit?: number) {
    this.query = query ?? "";
    this.limit = limit ?? 25;
  }
}