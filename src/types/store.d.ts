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
}

export interface PromptReport {
  prefName: string;
  patients: number;
  currentpatients: number;
  exits: number;
  deaths: number;
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
}
