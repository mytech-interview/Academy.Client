import React from 'react';
import SpecialOffers from '../components/SpecialOffers';
import { Language } from '../lib/translations';

interface OffersPageProps {
  lang: Language;
  onSelectCoursesTab: () => void;
  onOpenConsultation: () => void;
}

export default function OffersPage({ lang, onSelectCoursesTab, onOpenConsultation }: OffersPageProps) {
  return (
    <div className="pb-10 animate-fade-in">
      <SpecialOffers
        lang={lang}
        onSelectCoursesTab={onSelectCoursesTab}
        onOpenConsultation={onOpenConsultation}
      />
    </div>
  );
}