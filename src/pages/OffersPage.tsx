import React from 'react';
import SpecialOffers from '../components/SpecialOffers';

interface OffersPageProps {
  onSelectCoursesTab: () => void;
  onOpenConsultation: () => void;
}

export default function OffersPage({ onSelectCoursesTab, onOpenConsultation }: OffersPageProps) {
  return (
    <div className="pb-10 animate-fade-in">
      <SpecialOffers
        onSelectCoursesTab={onSelectCoursesTab}
        onOpenConsultation={onOpenConsultation}
      />
    </div>
  );
}