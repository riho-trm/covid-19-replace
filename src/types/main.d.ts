// export interface AllOverview extends Object {
//   bedRate: number;
//   currentPatients: number;
//   exists: number;
//   deaths: number;
//   beds: number;
//   patients: number;
//   clinicalEngineer: number;
//   ventilator: number;
//   ecmo: number;
//   patientsUpdate: Date;
//   bedsUPdate: Date;
// }

// export interface OverviewByPrefecture {
//   name: string;
//   name_jp: string;
//   patients: number;
//   currentpatients: number;
//   exits: number;
//   deaths: number;
//   bedsOfHospital: number;
//   bedsOfHotel: number;
//   code: string;
// }

// export interface PromptReport {
//   name: string;
//   patients: number;
//   exists: number;
//   deaths: number;
//   currentpatients: number;
//   lastUpdate: Date;
// }

export interface ComparisonWithPreviousDay {
  name: string;
  todayCurrentPatients: number;
  yesterdayCurrentPatients: number;
}
export interface PatientsNumberByMunicipality {
  lastUpdate: Date;
  datasets: {
    date: Date;
    data: ByMunicipalityData[];
  };
}
export interface ByMunicipalityData {
  code: number;
  area: string;
  label: string;
  ruby: string;
  count: number;
}

export interface Ventilator {
  prefName: string;
  clinicalEngineer: number;
  ventilator: number;
  ecmo: number;
}
