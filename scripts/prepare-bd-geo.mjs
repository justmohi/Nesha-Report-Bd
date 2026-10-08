import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { request } from 'node:https';

const VERSION='2026.08.04';
const DOWNLOAD_URL=`https://github.com/montasim/bangladesh-location-registry/releases/download/data-${VERSION}/address-bd-data-${VERSION}-json.tar.zst`;
const root=process.cwd(), cacheDir=path.join(root,'.geo-cache',VERSION), archive=path.join(cacheDir,'dataset.tar.zst'), extractDir=path.join(cacheDir,'extracted'), outputDir=path.join(root,'public','data','bd-geo');
const EXPECTED_SHA256='9b76179403d735231604aa460031b29b1a60123112f6ea5b27996269c1cd604c';
const outputs=['admin.json','unions.json','villages.json','manifest.json'];
if(outputs.every(n=>existsSync(path.join(outputDir,n))))process.exit(0);
mkdirSync(cacheDir,{recursive:true});mkdirSync(outputDir,{recursive:true});
function download(url,destination){return new Promise((resolve,reject)=>{const req=request(url,{headers:{'User-Agent':'Nesha-Report-Bd/1.0'}},res=>{if(res.statusCode>=300&&res.statusCode<400&&res.headers.location){res.resume();return download(new URL(res.headers.location,url).href,destination).then(resolve,reject)}if(res.statusCode!==200){res.resume();return reject(new Error(`Dataset download failed: HTTP ${res.statusCode}`))}pipeline(res,createWriteStream(destination)).then(resolve,reject)});req.on('error',reject);req.end()})}
function findFile(dir,name){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){const f=findFile(p,name);if(f)return f}else if(e.name===name)return p}return null}
function sha256(file){const h=createHash('sha256');h.update(readFileSync(file));return h.digest('hex')}
function records(file){const v=JSON.parse(readFileSync(file,'utf8'));return Array.isArray(v)?v:(v.records||[])}
function names(x){return{nameEn:x?.name?.en||'',nameBn:x?.name?.bn||x?.name?.en||''}}
function rel(x,parts){let v=x;for(const p of parts)v=v?.[p];return typeof v==='string'?v:''}
async function main(){
 if(!existsSync(archive)){console.log(`Downloading Bangladesh geography ${VERSION}...`);await download(DOWNLOAD_URL,archive)}
 if(sha256(archive)!==EXPECTED_SHA256)throw new Error('Downloaded Bangladesh geography archive failed SHA-256 verification.');
 if(!existsSync(extractDir))mkdirSync(extractDir,{recursive:true});
 if(!findFile(extractDir,'villages.json'))execFileSync('tar',['--zstd','-xf',archive,'-C',extractDir],{stdio:'inherit'});
 const files={divisions:findFile(extractDir,'divisions.json'),districts:findFile(extractDir,'zillas.json'),upazilas:findFile(extractDir,'upazilas.json'),unions:findFile(extractDir,'unions.json'),villages:findFile(extractDir,'villages.json')};
 if(Object.values(files).some(v=>!v))throw new Error('Expected geography entity files were not found in the verified release.');
 const current=readFileSync(path.join(root,'src','data','bdGeoData.ts'),'utf8');
 const m=current.match(/export const districts = (\[[\s\S]*?\]) as const;/);if(!m)throw new Error('Could not read district compatibility map.');
 const legacy=JSON.parse(m[1]);
 const divisions=records(files.divisions).map(x=>({id:x.key,...names(x)}));
 const districts=records(files.districts).map(x=>{const n=names(x);const d=legacy.find(d=>d.nameBn===n.nameBn||d.name.toLowerCase()===n.nameEn.toLowerCase()||(n.nameEn==='Comilla'&&d.name==='Cumilla')||(n.nameEn==='Jessore'&&d.name==='Jashore'));return{id:x.key,legacyId:d?`dist_${d.id}`:'',divisionId:rel(x,['relations','divisionKey']),...n}});
 const upazilas=records(files.upazilas).map(x=>({id:x.key,districtId:rel(x,['relations','zillaKey']),...names(x)}));
 const unions=records(files.unions).map(x=>({id:x.key,upazilaId:rel(x,['relations','upazilaKey'])||rel(x,['relations','administrativeArea','key']),districtId:rel(x,['relations','zillaKey']),divisionId:rel(x,['relations','divisionKey']),...names(x)}));
 const villages=records(files.villages).map(x=>({id:x.key,unionId:rel(x,['relations','unionKey'])||rel(x,['relations','localArea','key']),upazilaId:rel(x,['relations','upazilaKey'])||rel(x,['relations','administrativeArea','key']),districtId:rel(x,['relations','zillaKey']),divisionId:rel(x,['relations','divisionKey']),...names(x)})).filter(x=>x.unionId&&x.upazilaId);
 const manifest={source:'montasim/bangladesh-location-registry',version:VERSION,archiveSha256:EXPECTED_SHA256,generatedAt:new Date().toISOString(),counts:{divisions:divisions.length,districts:districts.length,upazilas:upazilas.length,unions:unions.length,villages:villages.length}};
 const write=(name,value)=>fs.writeFileSync(path.join(outputDir,name),value);
 write('admin.json',JSON.stringify({divisions,districts,upazilas}));
 write('unions.json',JSON.stringify(unions));
 write('villages.json',JSON.stringify(villages));
 write('manifest.json',JSON.stringify(manifest,null,2));
 console.log(`Bangladesh geography ready: ${villages.length.toLocaleString()} villages, ${unions.length.toLocaleString()} unions.`);
}
main().catch(e=>{console.error(e);process.exit(1)});