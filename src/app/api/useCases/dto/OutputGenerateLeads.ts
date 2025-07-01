import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import { Output } from "@/domain/Output";

export class OutputGenerateLeads {
  leads: OutputSearchLead;
  lastPage: number;

  constructor(leads?: OutputSearchLead, lastPage?: number) {
    this.leads = leads || new OutputSearchLead();
    this.lastPage = lastPage || 0;
  }

  static CreateOutput(leads?: OutputSearchLead, lastPage?: number): Output {
    if (!leads && !lastPage) {
      return new Output(false, [], ["No leads found"], null);
    }

    return new Output(true, [], [], new OutputGenerateLeads(leads, lastPage));
  }
}