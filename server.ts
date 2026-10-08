import express from'express';import path from'path';import{fileURLToPath}from'url';import dotenv from'dotenv';import{initializeApp,getApps,cert}from'firebase-admin/app';import{getFirestore}from'firebase-admin/firestore';import evidenceRoutes from'./backend/src/routes/evidenceRoutes.js';import reportRoutes from'./backend/src/routes/reportRoutes.js';import notificationRoutes from'./backend/src/routes/notificationRoutes.js';import auditRoutes from'./backend/src/routes/auditRoutes.js';import adminRoutes from'./backend/src/routes/adminRoutes.js';import{requireAuth}from'./backend/src/middleware/auth.js';dotenv.config();if(!getApps().length){const sa=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;initializeApp(sa?{credential:cert(JSON.parse(sa))}:{});}
const __filename=fileURLToPath(import.meta.url),__dirname=path.dirname(__filename);const app=express(),PORT=parseInt(process.env.PORT||'3000',10),isProd=process.env.NODE_ENV==='production';app.use(express.json({limit:'10mb'}));app.use(express.urlencoded({extended:true,limit:'10mb'}));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'Nesha Report BD',timestamp:new Date().toISOString()}));
app.get('/api/public/track',async(req,res)=>{
  try{
    const reportId=String(req.query.reportId||'').trim().toUpperCase();
    const pin=String(req.query.pin||'').trim();
    if(!reportId||!pin)return res.status(400).json({error:'Report ID and PIN are required'});
    const snap=await getFirestore().collection('reports').where('reportId','==',reportId).where('trackingPin','==',pin).limit(1).get();
    if(snap.empty)return res.status(404).json({error:'Report not found'});
    const r=snap.docs[0].data();
    return res.json({success:true,report:{
      id:snap.docs[0].id,
      reportId:r.reportId,
      jurisdiction:r.jurisdiction,
      incidentType:r.incidentType,
      description:r.description,
      incidentDate:r.incidentDate,
      incidentTime:r.incidentTime,
      location:r.location,
      status:r.status,
      statusHistory:r.statusHistory||[],
      actionTakenDetails:r.actionTakenDetails||'',
      createdAt:r.createdAt,
      updatedAt:r.updatedAt
    }});
  }catch(e){console.error('Public tracking error:',e);return res.status(500).json({error:'Unable to track report'})}
});
app.use('/api/evidence',requireAuth,evidenceRoutes);app.use('/api/reports',requireAuth,reportRoutes);app.use('/api/notifications',requireAuth,notificationRoutes);app.use('/api/audit',requireAuth,auditRoutes);app.use('/api/admin',requireAuth,adminRoutes);
async function start(){if(!isProd){const{createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true,host:'0.0.0.0',port:PORT},appType:'spa'});app.use(vite.middlewares)}else{const dist=path.resolve(__dirname,'dist');app.use(express.static(dist));app.get('*',(_req,res)=>res.sendFile(path.resolve(dist,'index.html')))}app.listen(PORT,'0.0.0.0',()=>console.log(`[Nesha Report BD] Server active on ${PORT}`))}start().catch(e=>{console.error(e);process.exit(1)});