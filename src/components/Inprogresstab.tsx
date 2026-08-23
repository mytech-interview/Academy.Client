import React from 'react';
import { useTranslation } from 'react-i18next';

interface InProgressTabProps {
  label: string;
}

export default function InProgressTab({ label }: InProgressTabProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200/80 shadow-sm">
      <h3 className="font-bold text-slate-700 text-base">{t('inProgressTab.title')}</h3>
      <p className="text-xs text-slate-400 mt-1">
        {t('inProgressTab.subtitle', { label })}
      </p>
    </div>
  );
}