import { OutputPhoneFormatter } from "./dto/OutputPhoneFormatter";

export const FormatPhoneNumber = (inputPhoneNumber: string): OutputPhoneFormatter => {
  if (!inputPhoneNumber || inputPhoneNumber.trim() === '')
    return new OutputPhoneFormatter('', '');

  const numbers = inputPhoneNumber.replace(/\D/g, '');
  if (numbers.length < 10) return new OutputPhoneFormatter('', '');

  const ddd = numbers.substring(0, 2);
  const numero = numbers.substring(2);

  const formatted = `${ddd}${numero.substring(0, numero.length - 4)}-${numero.substring(numero.length - 4)}`;
  const whatsappLink = `https://wa.me/55${ddd}${numero}`;

  return new OutputPhoneFormatter(formatted, whatsappLink);
}