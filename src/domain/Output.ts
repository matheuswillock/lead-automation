export class Output {
  isValid: boolean;
  successMessages: string[];
  errorMessages: string[];
  result: any;

  constructor(isValid: boolean, successMessages: string[], errorMessages: string[], result: any) {
    this.isValid = isValid;
    this.successMessages = successMessages;
    this.errorMessages = errorMessages;
    this.result = result;
  }

    static fromOutputResult(output: Output): Output {
      return new Output(output.isValid, output.successMessages, output.errorMessages, output.result);
    }
}