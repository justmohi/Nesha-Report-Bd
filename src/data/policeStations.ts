import { upazilas } from './bdGeoData';
import { Thana } from '../types';

const BANGLADESH_POLICE_URL = 'https://www.police.gov.bd/en/metropolitan_police';

type OfficialStation = Thana & { sourceDistrictNameEn: string; policeUnit: string };

const official = (district: string, unit: string, names: string[]): OfficialStation[] =>
  names.map((name) => ({
    id: `bp_${unit.toLowerCase()}_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`,
    districtId: '',
    nameEn: name,
    nameBn: name,
    code: undefined,
    source: 'BANGLADESH_POLICE',
    policeUnit: unit,
    sourceDistrictNameEn: district,
    sourceUrl: BANGLADESH_POLICE_URL,
  }));

// Verified metropolitan police-station names published on Bangladesh Police's metropolitan-unit pages.
// Bengali names are intentionally left as the published English name where the source page does not
// provide a Bengali station name; no translation is invented here.
export const officialPoliceStations: OfficialStation[] = [
  ...official('Dhaka', 'DMP', ['Adabor','Airport','Badda','Banani','Bangshal','Bhashantek','Cantonment','Chackbazar','Darussalam','Daskhinkhan','Demra','Dhanmondi','Gandaria','Gulshan','Hazaribag','Jatrabari','Kadamtoli','Kafrul','Kalabagan','Kamrangirchar','Khilgaon','Khilkhet','Kotwali','Lalbag','Mirpur Model','Mohammadpur','Motijheel','Mugda','New Market','Pallabi','Paltan Model','Ramna Model','Rampura','Rupnagar','Sabujbag','Shah ali','Shahbag','Sherebanglanagar','Shyampur','Sutrapur','Shahjahanpur','Tejgaon','Tejgaon I/A','Turag','Uttara Model','Uttarkhan','Uttara West','Vatara','Wari']),
  ...official('Chattogram', 'CMP', ['Kotwali','Chandgaon','Panchlaish','Doublemooring','Pahartali','Bandar','Baijid bostami','Hali Shohor','Kornafuli','Potenga','Bakolia','Akborsha','Shodhorgat','EPZ','Chokbazar','Kulshi']),
  ...official('Khulna', 'KMP', ['Khulna Sadar','Sonadangha','Khalishpur','Daulatpur','Khanjahan Ali','Labanchora','Horintana','Aranghata']),
  ...official('Rajshahi', 'RMP', ['Boalia model','Rajpara','Motihar','Shahmokhdum']),
  ...official('Sylhet', 'SMP', ['Kotoali','South Surma','Jalalabad','Airport','Moglabazar','Harzat Shah Paran']),
  ...official('Barishal', 'BMP', ['Kotowali model','Airport PS','Kawnia','Bondor PS']),
];

const legacyPoliceStations: Thana[] = (upazilas as Array<any>)
  .filter((item) => item.type === 'thana')
  .map((item) => ({
    id: `thana_${item.id}`,
    districtId: `dist_${item.districtId}`,
    nameEn: item.name,
    nameBn: item.nameBn || item.name,
    code: String(item.id),
    source: 'LEGACY_GEO',
  }));

// Keep the legacy source as a fallback for district/range stations until each station is
// reconciled against a current Bangladesh Police district/range source.
export const policeStations: Thana[] = [...officialPoliceStations, ...legacyPoliceStations];

export const getPoliceStations = () => policeStations;