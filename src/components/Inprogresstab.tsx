import React from 'react';

interface InProgressTabProps {
  label: string;
}

export default function InProgressTab({ label }: InProgressTabProps) {
  return (
    <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/80 shadow-sm">
      <h3 className="font-bold text-slate-700 text-base">სექცია მუშავდება</h3>
      <p className="text-xs text-slate-400 mt-1">არჩეული მენიუ ({label}) მალე დაემატება სრულად.</p>
    </div>
  );
}