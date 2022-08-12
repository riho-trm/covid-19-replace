export interface AllOverview extends Object {
  bedRate: number;
  currentPatients: number;
  exits: number;
  deaths: number;
  beds: number;
  patients: number;
  clinicalEngineer: number;
  ventilator: number;
  ecmo: number;
  patientsUpdate: Date;
  bedsUPdate: Date;
}

export interface OverviewByPrefecture {
  name: string;
  nameJp: string;
  currentpatients: number;
  bedsOfHospital: number;
  bedsOfHotel: number;
  code: string;
}

export interface ComparisonWithPreviousDay {
  name: string;
  todayCurrentPatients: number;
  yesterdayCurrentPatients: number;
}
