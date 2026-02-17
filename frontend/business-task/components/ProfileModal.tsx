import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { Rocket } from 'lucide-react';

interface ProfileModalProps {
  onSave: (profile: BusinessProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onSave }) => {
  const [form, setForm] = useState<BusinessProfile>({
    industry: '',
    targetAudience: '',
    productType: '',
    budget: '',
    launchDate: '',
    businessType: 'New Startup',
    targetRegion: 'National'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Tell us about your venture</h2>
          <p className="text-indigo-100 mt-1 text-sm">We'll tailor the roadmap and tasks to your specific needs.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry / Niche</label>
            <input 
              required
              type="text" 
              placeholder="e.g. SaaS, E-commerce, Local Service" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.industry}
              onChange={e => setForm({...form, industry: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Freelance designers, Busy moms" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.targetAudience}
              onChange={e => setForm({...form, targetAudience: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Type</label>
              <input 
                required
                type="text" 
                placeholder="e.g. App, Physical Good" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.productType}
                onChange={e => setForm({...form, productType: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Budget</label>
              <input 
                required
                type="text" 
                placeholder="e.g. $1k, $50k" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.businessType}
                onChange={e => setForm({...form, businessType: e.target.value as any})}
              >
                <option value="New Startup">New Startup</option>
                <option value="Existing Business">Existing Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Region</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={form.targetRegion}
                onChange={e => setForm({...form, targetRegion: e.target.value as any})}
              >
                <option value="Local">Local</option>
                <option value="National">National</option>
                <option value="Global">Global</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Launch Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.launchDate}
              onChange={e => setForm({...form, launchDate: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors mt-4"
          >
            Start My Journey
          </button>
        </form>
      </div>
    </div>
  );
};