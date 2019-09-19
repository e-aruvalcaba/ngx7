export interface IDatepickerSetup {
    dayLabels: IDayLabels;
    monthLabels: IMonthLabels;
    actionLabels: IActionLabels;
}
export interface IDayLabels {
    [key: string]: string;
    mo: string;
    tu: string;
    we: string;
    th: string;
    fr: string;
    sa: string;
    su: string;
}
export interface IMonthLabels {
    [key: string]: string;
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    aug: string;
    sep: string;
    oct: string;
    nov: string;
    dec: string;
}
export interface IActionLabels {
    [key: string]: string;
    cancelButton: string;
    applyButton: string;
}