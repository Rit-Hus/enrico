import React, { useState } from 'react';
import { Calendar, AlertCircle, Check, Plus, X } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderWidgetProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

export const ReminderWidget: React.FC<ReminderWidgetProps> = ({ reminders, setReminders }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = () => {
    if (!newTitle || !newDate) return;
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      title: newTitle,
      date: newDate,
      type: 'other',
      isCompleted: false
    };
    setReminders(prev => [...prev, newReminder]);
    setNewTitle('');
    setNewDate('');
    setIsAdding(false);
  };

  // Sort by date
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Key Deadlines
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
          <input 
            type="text" 
            placeholder="Event (e.g., Tax Filing)" 
            className="w-full text-sm p-2 border border-slate-300 rounded"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <input 
            type="date" 
            className="w-full text-sm p-2 border border-slate-300 rounded"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
          />
          <button 
            onClick={addReminder}
            className="w-full bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700"
          >
            Add Reminder
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3">
        {sortedReminders.length === 0 && !isAdding && (
          <p className="text-center text-slate-400 text-sm py-4">No upcoming reminders.</p>
        )}

        {sortedReminders.map(rem => {
          const daysLeft = Math.ceil((new Date(rem.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          const isUrgent = daysLeft <= 7 && !rem.isCompleted;

          return (
            <div 
              key={rem.id} 
              className={`p-3 rounded-lg border transition-all ${rem.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'} ${isUrgent ? 'border-l-4 border-l-red-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleReminder(rem.id)} className={`shrink-0 ${rem.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}>
                  {rem.isCompleted ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${rem.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {rem.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(rem.date).toLocaleDateString()} 
                    {!rem.isCompleted && (
                        <span className={`ml-2 ${daysLeft < 0 ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-slate-400'}`}>
                          {daysLeft < 0 ? 'Overdue' : `${daysLeft} days left`}
                        </span>
                    )}
                  </p>
                </div>
                <button onClick={() => deleteReminder(rem.id)} className="text-slate-300 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
