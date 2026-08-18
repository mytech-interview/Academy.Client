import React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ProjectItem } from '../types';
import { EmptyState } from './Asyncstates';

interface ProjectsTabProps {
  projects: ProjectItem[];
  onDelete: (id: string) => void;
}

// NOTE: no backend endpoint for featured projects yet — local state only.

export default function ProjectsTab({ projects, onDelete }: ProjectsTabProps) {
  return (
    <>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">მთავარ გვერდზე გამორჩეული პროექტები</h2>
          <p className="text-xs text-slate-400 mt-0.5">დაამატეთ და მართეთ გამორჩეული პროექტები</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition">
          <Plus className="w-4 h-4" /> პროექტის დამატება
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="გამორჩეული პროექტები ჯერ არ დამატებულა" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">{project.title}</h3>
                  <p className="text-xs text-slate-500 mt-2">ავტორი: {project.author}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button className="flex-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200">
                    <Pencil className="w-3.5 h-3.5 text-purple-600" />
                    პროექტის რედაქტირება
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-2.5 rounded-xl transition flex items-center justify-center border border-rose-100"
                    title="წაშლა"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}