import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { 
  FiMenu, 
  FiX, 
  FiBookOpen, 
  FiFileText, 
  FiAward, 
  FiDownload, 
  FiUploadCloud, 
  FiCheckCircle, 
  FiClock, 
  FiFile, 
  FiAlertCircle,
  FiPaperclip
} from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";
import { apiGet } from "../../../utils/api";
import { useToast } from "../../../context/ToastContext";

const Detailcourstudiant = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sequences"); // "sequences" | "tds" | "devoirs"
  
  // Dynamic course states
  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected TD and Devoir IDs
  const [selectedTdId, setSelectedTdId] = useState(null);
  const [selectedDevoirId, setSelectedDevoirId] = useState(null);

  // File upload simulation states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Local submissions storage to simulate backend delivery
  const [submissions, setSubmissions] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch course details
        const courseData = await apiGet(`/api/cours/${id}`);
        // 2. Fetch sequences for this course
        const sequencesData = await apiGet(`/api/cours/${id}/sequences`);
        
        // 3. Format sequences to match UI structure
        const formattedSequences = sequencesData.map(seq => ({
          id: seq.id,
          titre: seq.titre,
          contenu: seq.description || "Aucune description fournie pour cette séquence.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          duree: "2h 00m",
          objectifs: [
            "Maîtriser les notions clés abordées dans la séquence",
            "Appliquer les concepts théoriques à travers des exercices pratiques",
            "Consulter les supports de cours mis à disposition par le tuteur"
          ],
          ressources: seq.documentChemin ? [
            { titre: `Support de cours - ${seq.titre}`, lien: seq.documentChemin }
          ] : []
        }));

        // 4. Create TDs and Devoirs based on sequences containing exerciceChemin
        const formattedTds = sequencesData
          .filter(seq => seq.exerciceChemin)
          .map((seq, idx) => ({
            id: seq.id,
            titre: `TD ${idx + 1} : Exercice pratique - ${seq.titre}`,
            consigne: `Veuillez télécharger l'énoncé de l'exercice et soumettre votre travail complété avant la date limite.`,
            dateLimite: seq.dateFin || new Date().toLocaleDateString('fr-FR'),
            statut: "À faire",
            ressources: [
              { titre: `Énoncé de l'exercice - ${seq.titre}`, lien: seq.exerciceChemin }
            ]
          }));

        const formattedDevoirs = sequencesData
          .filter(seq => seq.exerciceChemin)
          .map((seq, idx) => ({
            id: seq.id + 1000, // offset id to avoid conflicts
            titre: `Devoir ${idx + 1} : Évaluation - ${seq.titre}`,
            consigne: `Travail individuel noté. Veillez à respecter les critères de rigueur et de sémantique vus en cours.`,
            dateLimite: seq.dateFin || new Date().toLocaleDateString('fr-FR'),
            statut: "À faire",
            ressources: [
              { titre: `Sujet du devoir - ${seq.titre}`, lien: seq.exerciceChemin }
            ]
          }));

        // 5. Construct course object matching mockData shape
        const coursObj = {
          id: courseData.id,
          titre: courseData.matiere?.nom || "Cours sans titre",
          description: courseData.matiere?.description || "Description non disponible",
          tuteur: courseData.enseignant ? `${courseData.enseignant.prenom} ${courseData.enseignant.nom}` : "Administration",
          duree: "30h",
          progress: formattedSequences.length > 0 ? 60 : 0,
          sequences: formattedSequences,
          tds: formattedTds,
          devoirs: formattedDevoirs
        };

        setCours(coursObj);
        setSelectedTdId(formattedTds[0]?.id || null);
        setSelectedDevoirId(formattedDevoirs[0]?.id || null);
        setLoading(false);
      } catch (err) {
        console.error("Error loading course details:", err);
        setError(err.message || "Impossible de charger les détails de ce cours.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  // Reset upload form when switching active TD/Devoir
  useEffect(() => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploading(false);
  }, [selectedTdId, selectedDevoirId, activeTab]);

  // Resolve active items
  const activeTd = cours?.tds?.find((t) => t.id === selectedTdId) || cours?.tds?.[0];
  const activeDevoir = cours?.devoirs?.find((d) => d.id === selectedDevoirId) || cours?.devoirs?.[0];

  // Submission handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadedFile(file.name);
            return 100;
          }
          return oldProgress + 20;
        });
      }, 150);
    }
  };

  const handleDeliver = (type, itemId) => {
    if (!uploadedFile) return;
    
    const key = `${type}-${cours.id}-${itemId}`;
    setSubmissions((prev) => ({
      ...prev,
      [key]: {
        submittedAt: new Date().toLocaleDateString("fr-FR"),
        filename: uploadedFile,
        status: "Soumis",
      },
    }));
    setUploadedFile(null);
  };

  // Resolve status for active items (taking local submissions into account)
  const getTdStatus = (td) => {
    if (!td) return {};
    const key = `td-${cours?.id}-${td.id}`;
    if (submissions[key]) {
      return { text: "Soumis", badgeClass: "bg-blue-50 text-blue-700 border-blue-100" };
    }
    if (td.statut === "Corrigé") {
      return { text: "Corrigé", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    }
    return { text: "À faire", badgeClass: "bg-amber-50 text-amber-700 border-amber-100" };
  };

  const getDevoirStatus = (devoir) => {
    if (!devoir) return {};
    const key = `devoir-${cours?.id}-${devoir.id}`;
    if (submissions[key]) {
      return { text: "Soumis", badgeClass: "bg-blue-50 text-blue-700 border-blue-100" };
    }
    if (devoir.statut === "Corrigé") {
      return { text: "Corrigé", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    }
    if (devoir.statut === "Soumis") {
      return { text: "Soumis", badgeClass: "bg-blue-50 text-blue-700 border-blue-100" };
    }
    return { text: "À faire", badgeClass: "bg-amber-50 text-amber-700 border-amber-100" };
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement des détails du cours...</div>
      </div>
    );
  }

  if (error || !cours) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error || "Cours introuvable."}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[3%] sm:px-[10%] relative pb-10">

      {/* HEADER */}
      <div className="w-full py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 mt-3 px-3 gap-3">
        <div className="flex items-center gap-2">
          {/* MENU MOBILE */}
          <button
            className="sm:hidden text-4xl p-1 hover:bg-slate-50 rounded-lg"
            onClick={() => setOpen(true)}
          >
            <IoMdArrowDropright className="text-orange-500" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {cours.titre}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tuteur : <strong className="text-orange-500 font-bold">{cours.tuteur}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
            <FiClock className="text-slate-400" />
            <span>Durée : <strong className="text-slate-700 font-semibold">{cours.duree}</strong></span>
          </div>
          <div className="w-24 sm:w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${cours.progress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-600">{cours.progress}%</span>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="w-full flex border-b border-slate-100 mt-4 overflow-x-auto gap-1">
        <button
          onClick={() => { setActiveTab("sequences"); setOpen(false); }}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-sm font-bold transition-all duration-200 whitespace-nowrap
            ${activeTab === "sequences" 
              ? "border-orange-500 text-orange-500 bg-orange-50/20" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
        >
          <FiBookOpen className="w-4 h-4" />
          Séquences
        </button>
        <button
          onClick={() => { setActiveTab("tds"); setOpen(false); }}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-sm font-bold transition-all duration-200 whitespace-nowrap
            ${activeTab === "tds" 
              ? "border-orange-500 text-orange-500 bg-orange-50/20" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
        >
          <FiFileText className="w-4 h-4" />
          Travaux Dirigés (TD)
          {cours.tds?.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-bold">
              {cours.tds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab("devoirs"); setOpen(false); }}
          className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-sm font-bold transition-all duration-200 whitespace-nowrap
            ${activeTab === "devoirs" 
              ? "border-orange-500 text-orange-500 bg-orange-50/20" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
        >
          <FiAward className="w-4 h-4" />
          Devoirs
          {cours.devoirs?.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full font-bold">
              {cours.devoirs.length}
            </span>
          )}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 sm:hidden z-40"
        />
      )}

      {/* LAYOUT */}
      <div className="flex min-h-[500px]">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed sm:static top-0 left-0 h-full sm:h-auto z-50
            w-64 bg-white border-r border-slate-100 p-5
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}
        >
          {/* CLOSE MOBILE */}
          <div className="flex justify-between items-center sm:hidden mb-4 border-b pb-2">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              {activeTab === "sequences" ? "Séquences" : activeTab === "tds" ? "Fiches TD" : "Évaluations"}
            </h2>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded">
              <FiX className="text-xl text-slate-600" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              {activeTab === "sequences" ? "Contenu du cours" : activeTab === "tds" ? "Liste des TDs" : "Liste des Devoirs"}
            </span>

            {/* RENDER SIDEBAR ITEMS BASED ON TAB */}
            {activeTab === "sequences" && cours.sequences.map((sequence) => (
              <NavLink
                key={sequence.id}
                to={`sequence/${sequence.id}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-xs font-bold px-3 py-3 rounded-xl transition-all flex items-center gap-2.5 border border-transparent
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-600 hover:text-orange-500 hover:bg-orange-50/40"
                  }`
                }
              >
                <FiBookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{sequence.titre}</span>
              </NavLink>
            ))}

            {activeTab === "tds" && cours.tds?.map((td) => {
              const status = getTdStatus(td);
              return (
                <button
                  key={td.id}
                  onClick={() => { setSelectedTdId(td.id); setOpen(false); }}
                  className={`text-left text-xs font-bold px-3 py-3 rounded-xl transition-all flex flex-col gap-1 border
                    ${
                      activeTd?.id === td.id
                        ? "bg-slate-50 border-orange-200 text-orange-600"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FiFileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{td.titre}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 px-1">
                    <span className="text-[9px] text-slate-400">Limite : {td.deadline}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black border uppercase ${status.badgeClass}`}>
                      {status.text}
                    </span>
                  </div>
                </button>
              );
            })}

            {activeTab === "devoirs" && cours.devoirs?.map((devoir) => {
              const status = getDevoirStatus(devoir);
              return (
                <button
                  key={devoir.id}
                  onClick={() => { setSelectedDevoirId(devoir.id); setOpen(false); }}
                  className={`text-left text-xs font-bold px-3 py-3 rounded-xl transition-all flex flex-col gap-1 border
                    ${
                      activeDevoir?.id === devoir.id
                        ? "bg-slate-50 border-orange-200 text-orange-600"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FiAward className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{devoir.titre}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 px-1">
                    <span className="text-[9px] text-slate-400">Coef : {devoir.coefficient}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black border uppercase ${status.badgeClass}`}>
                      {status.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 p-3 md:p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[450px]">
            
            {/* VIEW 1: SEQUENCES */}
            {activeTab === "sequences" && <Outlet />}

            {/* VIEW 2: TRAVAUX DIRIGÉS (TD) */}
            {activeTab === "tds" && (
              activeTd ? (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{activeTd.titre}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>Date limite : <strong className="text-slate-600">{activeTd.deadline}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getTdStatus(activeTd).badgeClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {getTdStatus(activeTd).text}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consigne</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {activeTd.description}
                    </p>
                  </div>

                  {/* FILE ATTACHMENT */}
                  <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document à télécharger</h3>
                    <div className="mt-3 flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-50 text-rose-500 rounded-lg">
                          <FiFile className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{activeTd.fichierNom || "Fiche_TD.pdf"}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Fichier PDF • 420 KB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => showToast("Simulation du téléchargement du fichier sujet...", "info")}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      >
                        <FiDownload />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>

                  {/* SUBMISSION / CORRECTION SECTION */}
                  <div className="mt-8 border-t pt-6">
                    {activeTd.statut === "Corrigé" ? (
                      <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <FiCheckCircle className="text-emerald-500 w-6 h-6 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-emerald-800">Évaluation corrigée</h4>
                            <p className="text-xs text-emerald-600 mt-0.5">Votre enseignant a noté et corrigé votre travail.</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-emerald-100/50 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Note</span>
                            <span className="text-lg font-black text-emerald-600 block mt-1">{activeTd.note}</span>
                          </div>
                          <div className="sm:col-span-3 bg-white p-3 rounded-lg border border-emerald-100/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Feedback du tuteur</span>
                            <p className="text-xs text-slate-600 mt-1 italic">"{activeTd.feedback}"</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rendre mon travail</h3>
                        
                        {/* If already submitted locally */}
                        {submissions[`td-${cours.id}-${activeTd.id}`] ? (
                          <div className="mt-3 bg-blue-50/30 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FiCheckCircle className="text-blue-500 w-5 h-5 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-blue-800">Travail rendu avec succès !</p>
                                <p className="text-[10px] text-blue-500 mt-0.5">Fichier : {submissions[`td-${cours.id}-${activeTd.id}`].filename} • Rendu le {submissions[`td-${cours.id}-${activeTd.id}`].submittedAt}</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg uppercase">
                              En attente de note
                            </span>
                          </div>
                        ) : (
                          /* Submission Box */
                          <div className="mt-3 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-300 transition-colors duration-200 bg-slate-50/30">
                            {uploading ? (
                              <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-slate-500">Téléversement du fichier...</span>
                                  <span className="text-xs font-bold text-orange-500">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div className="bg-orange-500 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                                </div>
                              </div>
                            ) : uploadedFile ? (
                              <div className="flex flex-col items-center">
                                <FiFile className="w-10 h-10 text-orange-500" />
                                <p className="text-xs font-bold text-slate-700 mt-2">{uploadedFile}</p>
                                <p className="text-[10px] text-slate-400 mt-1">Prêt à être envoyé</p>
                                <div className="flex items-center gap-2 mt-4">
                                  <button 
                                    onClick={() => setUploadedFile(null)} 
                                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition"
                                  >
                                    Annuler
                                  </button>
                                  <button 
                                    onClick={() => handleDeliver("td", activeTd.id)}
                                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-orange-500/10 transition"
                                  >
                                    Envoyer le devoir
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center w-full">
                                <FiUploadCloud className="w-10 h-10 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                <span className="text-xs font-bold text-slate-700 mt-2">Cliquez pour téléverser votre fichier</span>
                                <span className="text-[10px] text-slate-400 mt-1">Format PDF, ZIP acceptés (Max. 10MB)</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,.zip,.rar" 
                                  onChange={handleFileChange} 
                                />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FiAlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-400 text-sm mt-2 font-medium">Aucun TD disponible pour ce cours.</p>
                </div>
              )
            )}

            {/* VIEW 3: DEVOIRS */}
            {activeTab === "devoirs" && (
              activeDevoir ? (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{activeDevoir.titre}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>Date limite : <strong className="text-slate-600">{activeDevoir.deadline}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 border px-2 py-0.5 rounded">
                          <span>Coefficient : <strong>{activeDevoir.coefficient}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getDevoirStatus(activeDevoir).badgeClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {getDevoirStatus(activeDevoir).text}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consigne du devoir</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      {activeDevoir.description}
                    </p>
                  </div>

                  {/* SUBMISSION / CORRECTION SECTION */}
                  <div className="mt-8 border-t pt-6">
                    {activeDevoir.statut === "Corrigé" ? (
                      <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <FiCheckCircle className="text-emerald-500 w-6 h-6 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-emerald-800">Évaluation corrigée</h4>
                            <p className="text-xs text-emerald-600 mt-0.5">Votre enseignant a noté et corrigé votre copie.</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-emerald-100/50 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Note</span>
                            <span className="text-lg font-black text-emerald-600 block mt-1">{activeDevoir.note}</span>
                          </div>
                          <div className="sm:col-span-3 bg-white p-3 rounded-lg border border-emerald-100/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Feedback du tuteur</span>
                            <p className="text-xs text-slate-600 mt-1 italic">"{activeDevoir.feedback}"</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rendre ma copie</h3>
                        
                        {/* If already submitted locally */}
                        {submissions[`devoir-${cours.id}-${activeDevoir.id}`] ? (
                          <div className="mt-3 bg-blue-50/30 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FiCheckCircle className="text-blue-500 w-5 h-5 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-blue-800">Copie rendue avec succès !</p>
                                <p className="text-[10px] text-blue-500 mt-0.5">Fichier : {submissions[`devoir-${cours.id}-${activeDevoir.id}`].filename} • Rendu le {submissions[`devoir-${cours.id}-${activeDevoir.id}`].submittedAt}</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg uppercase">
                              En correction
                            </span>
                          </div>
                        ) : (
                          /* Submission Box */
                          <div className="mt-3 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-300 transition-colors duration-200 bg-slate-50/30">
                            {uploading ? (
                              <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-slate-500">Téléversement de la copie...</span>
                                  <span className="text-xs font-bold text-orange-500">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div className="bg-orange-500 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                                </div>
                              </div>
                            ) : uploadedFile ? (
                              <div className="flex flex-col items-center">
                                <FiFile className="w-10 h-10 text-orange-500" />
                                <p className="text-xs font-bold text-slate-700 mt-2">{uploadedFile}</p>
                                <p className="text-[10px] text-slate-400 mt-1">Prêt à être envoyé</p>
                                <div className="flex items-center gap-2 mt-4">
                                  <button 
                                    onClick={() => setUploadedFile(null)} 
                                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition"
                                  >
                                    Annuler
                                  </button>
                                  <button 
                                    onClick={() => handleDeliver("devoir", activeDevoir.id)}
                                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-orange-500/10 transition"
                                  >
                                    Envoyer la copie
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center w-full">
                                <FiUploadCloud className="w-10 h-10 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                <span className="text-xs font-bold text-slate-700 mt-2">Cliquez pour téléverser votre copie</span>
                                <span className="text-[10px] text-slate-400 mt-1">Format PDF, ZIP acceptés (Max. 15MB)</span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,.zip,.rar" 
                                  onChange={handleFileChange} 
                                />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FiAlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-400 text-sm mt-2 font-medium">Aucun Devoir disponible pour ce cours.</p>
                </div>
              )
            )}

          </div>
        </main>

      </div>
    </div>
  );
};

export default Detailcourstudiant;