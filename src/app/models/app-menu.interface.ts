export interface IAppMenu {
  icon: string;
  title: string;
  shortTitle: string;
  description: string;
  active: boolean;
  routeLink: string;
  href: string;
  childs: IAppMenu[]
}
