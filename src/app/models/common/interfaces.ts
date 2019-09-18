export interface ICreated {
  createdAt: Date;
  success: boolean;
  id: number;
}

export interface IException {
  httpCode: string;
  httpMessage: string;
  moreInformation: string;
  reasonCode: string;
}

export interface ISuccess {
  success: string;
}

export interface IUpdated {
  createdAt: Date;
  success: boolean;
  id: number;
}
