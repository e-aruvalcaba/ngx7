import { HolidayType } from "./HolidayType";
import { CountryEntity } from "./Country";

export class Holiday {
    public holidayId: number;
    public country: CountryEntity;
    public name: string;
    public holidayDesc: string;
    public holidayTypes: Array<HolidayType>;
    public isAddicionalServiceEnabled: boolean;
    public date: HolidayDate;
    public holidayDate: string;
    public affectedDate: string;

    constructor() {
        this.country = new CountryEntity();
        this.date = new HolidayDate();
        this.holidayTypes = [];
        this.holidayId = 0;
    }
}

export class HolidayDate {
    public iso: string;
    public dateTime: ScrambledDateTime;

    constructor() {
        this.iso = '';
        this.dateTime = new ScrambledDateTime();        
    }
}

export class ScrambledDateTime {
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public minute: number;
    public second: number;
}