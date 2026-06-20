import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FiClock, 
  FiCheckCircle, 
  FiPaperclip, 
  FiDownload, 
  FiBookOpen,
  FiPlay,
  FiChevronRight
} from "react-icons/fi";
import { coursesData } from "../../../utils/mockData";
import { useToast } from "../../../context/ToastContext";

export default function DetailSequence() {
  const { showToast } = useToast();
  const { id, sequenceId } = useParams();
  
  
  const cours = coursesData.find((c) => c.id === Number(id)) || coursesData[0];
  
  
  const sequence = cours.sequences.find(
    (seq) => seq.id === Number(sequenceId)
  ) || cours.sequences[0];

  const [isCompleted, setIsCompleted] = useState(false);

  
  useEffect(() => {
    if (cours && sequence) {
      const completed = localStorage.getItem(`seq-completed-${cours.id}-${sequence.id}`);
      setIsCompleted(completed === "true");
    }
  }, [cours, sequence]);

  if (!sequence) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-500">Séquence introuvable.</h2>
      </div>
    );
  }

  const handleComplete = () => {
    const newState = !isCompleted;
    localStorage.setItem(`seq-completed-${cours.id}-${sequence.id}`, String(newState));
    setIsCompleted(newState);
  };

  return (
    <div className="w-full animate-fadeIn">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-3">
        <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">
            Séquence {sequence.id}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
            {sequence.titre}
          </h2>
        </div>
        
        {sequence.duree && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold shrink-0 bg-slate-50 border px-3 py-1.5 rounded-lg">
            <FiClock />
            <span>Temps de lecture : {sequence.duree}</span>
          </div>
        )}
      </div>

      {}
      {sequence.videoUrl && (
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cours vidéo</h3>
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border shadow-inner">
            <video 
              src={sequence.videoUrl} 
              controls 
              className="w-full h-full object-contain"
              poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
            />
          </div>
        </div>
      )}

      {}
      {sequence.objectifs && sequence.objectifs.length > 0 && (
        <div className="mt-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FiCheckCircle className="text-orange-500" />
            Objectifs d'apprentissage
          </h3>
          <ul className="space-y-2">
            {sequence.objectifs.map((objectif, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                <FiChevronRight className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{objectif}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contenu de la leçon</h3>
        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          {sequence.contenu}
        </div>
      </div>

      {}
      {sequence.ressources && sequence.ressources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supports complémentaires</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sequence.ressources.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition duration-150">
                <div className="flex items-center gap-2 min-w-0">
                  <FiPaperclip className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 truncate">{res.titre}</span>
                </div>
                <button 
                  onClick={() => showToast(`Téléchargement de : ${res.titre}`, "info")}
                  className="p-1.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-500 text-slate-500 rounded-lg transition"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="mt-8 border-t pt-6 flex justify-end">
        <button
          onClick={handleComplete}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm
            ${
              isCompleted
                ? "bg-emerald-500 text-white shadow-emerald-500/10"
                : "bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 hover:shadow-orange-500/10"
            }`}
        >
          <FiCheckCircle className={`w-4 h-4 ${isCompleted ? "animate-bounce" : ""}`} />
          <span>{isCompleted ? "Séquence terminée !" : "Marquer comme terminée"}</span>
        </button>
      </div>
    </div>
  );
}