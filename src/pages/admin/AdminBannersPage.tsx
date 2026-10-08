import React, { useEffect, useState } from 'react';
import { HomeBanner } from '../../types';
import { dataService } from '../../services/dataService';
import { Image, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Shield } from 'lucide-react';

const emptyBanner=(order:number):HomeBanner=>({
  id: `banner-${Date.now()}-${order}`,
  imageUrl:'',
  titleBn:'',
  titleEn:'',
  subtitleBn:'',
  subtitleEn:'',
  buttonLabelBn:'',
  buttonLabelEn:'',
  buttonTab:'report',
  order,
  isActive:false,
  updatedAt:new Date().toISOString()
});

export const AdminBannersPage: React.FC = () => {
  const [banners,setBanners]=useState<HomeBanner[]>([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState<string|null>(null);
  const [message,setMessage]=useState('');

  const load=async()=>{setLoading(true);try{setBanners(await dataService.getAllHomeBanners())}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);

  const add=()=>{
    if(banners.length>=5){setMessage('সর্বোচ্চ ৫টি ব্যানার রাখা যাবে।');return}
    setBanners(prev=>[...prev,emptyBanner(prev.length+1)]);
  };
  const update=(id:string,key:keyof HomeBanner,value:any)=>setBanners(prev=>prev.map(b=>b.id===id?{...b,[key]:value}:b));
  const save=async(b:HomeBanner)=>{
    setSaving(b.id);setMessage('');
    try{
      const normalized={...b,order:b.order,isActive:b.isActive,updatedAt:new Date().toISOString()};
      await dataService.saveHomeBanner(normalized);
      await load();setMessage('ব্যানার সংরক্ষণ হয়েছে।');
    }catch(e:any){setMessage(e.message||'ব্যানার সংরক্ষণ করা যায়নি।')}finally{setSaving(null)}
  };
  const remove=async(id:string)=>{
    if(!confirm('এই ব্যানারটি সরাতে চান?'))return;
    await dataService.deleteHomeBanner(id);await load();setMessage('ব্যানার সরানো হয়েছে।');
  };
  const move=(id:string,dir:number)=>{
    setBanners(prev=>{
      const arr=[...prev].sort((a,b)=>a.order-b.order);
      const i=arr.findIndex(x=>x.id===id),j=i+dir;
      if(i<0||j<0||j>=arr.length)return prev;
      [arr[i],arr[j]]=[arr[j],arr[i]];
      return arr.map((x,k)=>({...x,order:k+1}));
    });
  };

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006a4e] mb-2"><Shield className="w-4 h-4"/> হোমপেজ ব্যানার ব্যবস্থাপনা</div>
        <h1 className="text-2xl font-bold text-slate-900">Hero Slider / Banner</h1>
        <p className="text-sm text-slate-500 mt-1">সর্বোচ্চ ৫টি ব্যানার সেট করুন। হোমপেজে এগুলো স্বয়ংক্রিয়ভাবে স্লাইড হবে।</p>
      </div>
      <button onClick={add} disabled={banners.length>=5} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#006a4e] text-white text-sm font-semibold disabled:opacity-40"><Plus className="w-4 h-4"/> নতুন ব্যানার</button>
    </div>

    {message&&<div className="bg-emerald-50 border border-emerald-200 text-[#006a4e] rounded-md px-4 py-3 text-sm">{message}</div>}

    {loading?<div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">Loading…</div>:
      <div className="space-y-5">{banners.map((b,i)=><div key={b.id} className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-slate-900">Slide {b.order}</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>move(b.id,-1)} disabled={i===0} className="p-2 border rounded-md disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
            <button onClick={()=>move(b.id,1)} disabled={i===banners.length-1} className="p-2 border rounded-md disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
            <button onClick={()=>update(b.id,'isActive',!b.isActive)} className={`p-2 rounded-md border ${b.isActive?'text-[#006a4e] bg-emerald-50':'text-slate-400 bg-slate-50'}`}>{b.isActive?<Eye className="w-4 h-4"/>:<EyeOff className="w-4 h-4"/>}</button>
            <button onClick={()=>remove(b.id)} className="p-2 rounded-md border text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="grid lg:grid-cols-[280px_1fr] gap-5">
          <div>
            <div className="aspect-[16/7] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              {b.imageUrl?<img src={b.imageUrl} alt="" className="w-full h-full object-cover"/>:<Image className="w-8 h-8 text-slate-300"/>}
            </div>
            <label className="block text-xs font-semibold text-slate-600 mt-3 mb-1">Image URL</label>
            <input value={b.imageUrl} onChange={e=>update(b.id,'imageUrl',e.target.value)} placeholder="https://..." className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"/>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="বাংলা শিরোনাম" value={b.titleBn} onChange={v=>update(b.id,'titleBn',v)}/>
            <Field label="English title" value={b.titleEn} onChange={v=>update(b.id,'titleEn',v)}/>
            <Field label="বাংলা সাবটাইটেল" value={b.subtitleBn||''} onChange={v=>update(b.id,'subtitleBn',v)}/>
            <Field label="English subtitle" value={b.subtitleEn||''} onChange={v=>update(b.id,'subtitleEn',v)}/>
            <Field label="বাংলা বাটন" value={b.buttonLabelBn||''} onChange={v=>update(b.id,'buttonLabelBn',v)}/>
            <Field label="English button" value={b.buttonLabelEn||''} onChange={v=>update(b.id,'buttonLabelEn',v)}/>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Button action</label><select value={b.buttonTab||'report'} onChange={e=>update(b.id,'buttonTab',e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"><option value="report">Report</option><option value="track">Track</option><option value="safety">Safety</option><option value="home">Home</option></select></div>
            <div className="flex items-end"><button onClick={()=>save(b)} disabled={saving===b.id||!b.imageUrl||!b.titleEn||!b.titleBn} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-md bg-[#006a4e] text-white text-sm font-semibold disabled:opacity-40"><Save className="w-4 h-4"/>{saving===b.id?'Saving…':'Save Banner'}</button></div>
          </div>
        </div>
      </div>)}
      {!banners.length&&<div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500">কোনো ব্যানার নেই। “নতুন ব্যানার” দিয়ে শুরু করুন।</div>}</div>}
  </div>;
};

const Field=({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void})=><div><label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label><input value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"/></div>;

export default AdminBannersPage;
