import { MenuItem } from "./menuItem";

export class ApplicationMenu {
    public applicationMenuId: number;
    public applicationIcon: string;
    public applicationTitle: string;
    public applicationUrl: string;
    public menu: Menu;

    /**
     *
     */
    constructor() {
        this.menu = new Menu();
    }
}

export class Menu {
    public menuEndpoint: string;
    public menuId: number;
    public menuItems: MenuItem[];
    public menuTitle: string;

    /**
     *
     */
    constructor() {
        this.menuItems = new Array<MenuItem>();
    }
}