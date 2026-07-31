import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";


interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description: string;
}


export default function GallerySection() {

  const { t } = useTranslation();

  const [activePhotoIndex, setActivePhotoIndex] =
    useState<number | null>(null);


  const photos: GalleryItem[] = [
    {
      id: "photo-1",
      title: t("gallery.photos.photo1.title"),
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      description: t("gallery.photos.photo1.description"),
    },

    {
      id: "photo-2",
      title: t("gallery.photos.photo2.title"),
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      description: t("gallery.photos.photo2.description"),
    },

    {
      id: "photo-3",
      title: t("gallery.photos.photo3.title"),
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
      description: t("gallery.photos.photo3.description"),
    },

    {
      id: "photo-4",
      title: t("gallery.photos.photo4.title"),
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
      description: t("gallery.photos.photo4.description"),
    },
  ];


  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (activePhotoIndex === null) return;

    setActivePhotoIndex((prev) =>
      prev === 0 ? photos.length - 1 : (prev ?? 0) - 1
    );
  };


  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (activePhotoIndex === null) return;

    setActivePhotoIndex((prev) =>
      prev === photos.length - 1 ? 0 : (prev ?? 0) + 1
    );
  };


  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">

      <div className="space-y-6">


        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

          <div className="space-y-1.5">

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600">
              {t("gallery.badge")}
            </span>


            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {t("gallery.title")}
            </h2>


            <p className="text-xs text-slate-500 max-w-md">
              {t("gallery.desc")}
            </p>

          </div>


          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <ImageIcon />
          </div>


        </div>



        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


          {photos.map((ph,index)=>(

            <div
              key={ph.id}
              onClick={()=>setActivePhotoIndex(index)}
              className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 cursor-pointer"
            >

              <img
                src={ph.image}
                alt={ph.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />


              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"/>


              <div className="absolute bottom-0 p-4 opacity-0 group-hover:opacity-100 transition">

                <span className="text-[10px] text-indigo-300 uppercase">
                  {t("gallery.location")}
                </span>

                <h4 className="text-white text-xs font-bold">
                  {ph.title}
                </h4>

              </div>


              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">

                <div className="bg-white rounded-full p-2">
                  <Eye size={16}/>
                </div>

              </div>


            </div>

          ))}


        </div>

      </div>



      <AnimatePresence>

      {activePhotoIndex !== null && (

        <div
          onClick={()=>setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >


          <motion.div
            initial={{opacity:0,scale:.95}}
            animate={{opacity:1,scale:1}}
            exit={{opacity:0,scale:.95}}
            onClick={(e)=>e.stopPropagation()}
            className="relative bg-white rounded-3xl p-5 max-w-3xl w-full"
          >


            <button
              onClick={()=>setActivePhotoIndex(null)}
              className="absolute right-5 top-5"
            >
              <X/>
            </button>



            <button
              onClick={handlePrev}
              className="absolute left-5 top-1/2"
            >
              <ChevronLeft/>
            </button>


            <button
              onClick={handleNext}
              className="absolute right-5 top-1/2"
            >
              <ChevronRight/>
            </button>



            <img
              src={photos[activePhotoIndex].image}
              className="rounded-2xl w-full"
            />


            <h3 className="mt-4 font-black text-xl">
              {photos[activePhotoIndex].title}
            </h3>


            <p className="text-slate-500 mt-2">
              {photos[activePhotoIndex].description}
            </p>


          </motion.div>


        </div>

      )}

      </AnimatePresence>


    </section>
  );
}