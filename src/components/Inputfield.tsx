import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export default function InputField({ label, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5 truncate">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-800"
      />
    </div>
  );
}