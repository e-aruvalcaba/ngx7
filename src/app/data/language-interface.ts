export interface ILanguage{

    authorLanguage?: string,
    countryCode: string,
    currencyFormat: string,
    currencyName: string,
    currencySymbol: string,
    currencySymbolFloat: string,
    dayNames: string,
    decimalNumbers: number,
    decimalNumbersMoney: number,
    decimalSeparator: string,
    dir?: string,
    formatDate: string,
    formatTime: string,
    hoursCode: string,
    isSelected:boolean,
    languageCountry: string,
    languageISO: string,
    languageId: number,
    languageName: string,
    minutesCode: string,
    momentConfig: {months: string[], monthsShort: string[], weekdays: string[], weekdaysMin: string[], weekdaysShort: string[]}
    monthNames: string,
    rtl?: boolean
    secondsCode: string,
    shortDayMonths: string,
    shortDayNames: string,
    shortDayNames2: string,
    textFloat: string,
    thousandSeparator: string
}
