export interface PatientsNumberOfAll extends Object {
  patients: number;
  currentPatients: number;
  exits: number;
  deaths: number;
  lastUpdate: Date;
}

export interface PatientsNumberByPrefecture {
  prefName: string;
  nameJp: string;
  patients: number;
  currentPatients: number;
  exits: number;
  deaths: number;
  code: string;
  source: string;
  sourceUrl: string;
}

export interface PromptReport {
  prefName: string;
  patients: number;
  currentPatients: number;
  exits: number;
  deaths: number;
  source: string;
  sourceUrl: string;
  lastUpdate: Date;
}

export interface Beds {
  prefName: string;
  bedsOfHospital: number;
  bedsOfHotel: number;
  lastUpdate: Date;
}

export interface PrefAppUrl {
  code: string;
  url: string;
  appUrl: string;
}

export interface Ventilator {
  prefName: string;
  clinicalEngineer: number;
  ventilator: number;
  ecmo: number;
}
