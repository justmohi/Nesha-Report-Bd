import { upazilas } from './bdGeoData';

export const policeStations = upazilas
  .filter((item) => item.type === 'thana')
  .map((item) => ({
    id: `thana_${item.id}`,
    districtId: `dist_${item.districtId}`,
    nameEn: item.name,
    nameBn: item.nameBn,
    code: String(item.id),
  }));

export const getPoliceStations = () => policeStations;
