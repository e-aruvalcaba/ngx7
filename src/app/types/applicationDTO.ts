export class ApplicationDTO {
  constructor(name?: string, description?: string, applicationItemTechnicalName?: string) {
    this.applicationItemName = name;
    this.applicationItemDescription = description;
    this.applicationItemTechnicalName = applicationItemTechnicalName;
  }
  applicationItemTechnicalName: string;
  applicationItemId: number;
  applicationItemDescription: string;
  applicationItemName: string;
  author: string;
}
