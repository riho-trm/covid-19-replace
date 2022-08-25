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
