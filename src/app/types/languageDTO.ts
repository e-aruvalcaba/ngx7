export class LanguageDTO {
  constructor(
    country?: string,
    iso?: string,
    name?: string,
    currencySymbol?: string,
    currencySymbolFloat?: string,
    currencyFormat?: string,
    currencyName?: string,
    formatDate?: string,
    formatTime?: string,
    decimalSeparator?: string,
    decimalNumbers?: number,
    thousandSeparator?: string,
    textFloat?: string,
    languageId?: number
  ) {
    this.languageCountry = country;
    this.languageISO = iso;
    this.languageName = name;
    this.currencySymbol = currencySymbol;
    this.currencySymbolFloat = currencySymbolFloat;
    this.currencyFormat = currencyFormat;
    this.currencyName = currencyName;
    this.formatDate = formatDate;
    this.formatTime = formatTime;
    this.decimalSeparator = decimalSeparator;
    this.thousandSeparator = thousandSeparator;
    this.textFloat = textFloat;
    this.decimalNumbers = decimalNumbers;
    this.languageId = languageId;
  }

  languageId: number;
  languageCountry: string;
  languageISO: string;
  languageName: string;

  author: string;

  currencySymbol: string;
  currencyFormat: string;
  currencyName: string;
  currencySymbolFloat: string;
  formatDate: string;
  formatTime: string;
  decimalSeparator: string;
  decimalNumbers: number;
  thousandSeparator: string;
  textFloat: string;
}
