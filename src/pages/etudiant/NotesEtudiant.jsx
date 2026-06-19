import React, { useState, useEffect } from "react";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiDownload, 
  FiPrinter, 
  FiCheckCircle, 
  FiXCircle, 
  FiBook, 
  FiPercent, 
  FiX, 
  FiCheck, 
  FiInfo, 
  FiFileText,
  FiTrendingUp
} from "react-icons/fi";
import { apiGet } from "../../utils/api";
import { useToast } from "../../context/ToastContext";

export default function NotesEtudiant() {
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentName = user.prenom && user.nom ? `${user.prenom} ${user.nom.toUpperCase()}` : "Diene THIAM";

  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [filterStatut, setFilterStatut] = useState("Tous"); // "Tous" | "Validé" | "Rattrapage" | "En cours"
  const [showModalBulletin, setShowModalBulletin] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Helper to calculate course average
  const calculateCourseAverage = (course) => {
    if (course.statut === "En cours" && !course.examen) return null;

    // Average TDs
    const tdSum = course.tds.reduce((acc, td) => acc + (td.note || 0) * td.coef, 0);
    const tdCoefSum = course.tds.reduce((acc, td) => acc + td.coef, 0);
    const tdAvg = tdCoefSum > 0 ? tdSum / tdCoefSum : null;

    // Average Devoirs
    const devoirSum = course.devoirs.reduce((acc, dev) => acc + (dev.note || 0) * dev.coef, 0);
    const devoirCoefSum = course.devoirs.reduce((acc, dev) => acc + dev.coef, 0);
    const devoirAvg = devoirCoefSum > 0 ? devoirSum / devoirCoefSum : null;

    // Exam
    const examNote = course.examen?.note;

    // Formula: 30% TDs + 30% Devoirs + 40% Exam
    if (examNote !== undefined && examNote !== null) {
      const tAvg = tdAvg !== null ? tdAvg : examNote;
      const dAvg = devoirAvg !== null ? devoirAvg : examNote;
      const finalAvg = (tAvg * 0.3) + (dAvg * 0.3) + (examNote * 0.4);
      return Math.round(finalAvg * 100) / 100;
    } else {
      const activeAvgs = [];
      if (tdAvg !== null) activeAvgs.push(tdAvg);
      if (devoirAvg !== null) activeAvgs.push(devoirAvg);
      if (activeAvgs.length === 0) return null;
      const finalAvg = activeAvgs.reduce((a, b) => a + b, 0) / activeAvgs.length;
      return Math.round(finalAvg * 100) / 100;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const notesList = await apiGet("/api/notes/me");
        
        // Group notes by matiere
        const matiereGroups = {};
        
        notesList.forEach(note => {
          const mat = note.matiere || { id: 0, nom: "Matière inconnue", code: "UNKNOWN" };
          if (!matiereGroups[mat.id]) {
            matiereGroups[mat.id] = {
              id: mat.id,
              titre: mat.nom,
              tuteur: note.formation && note.formation.formateur ? `${note.formation.formateur.prenom} ${note.formation.formateur.nom}` : "Administration",
              ects: 4, // Default ECTS per course
              statut: "En cours",
              examen: null,
              tds: [],
              devoirs: []
            };
          }

          const group = matiereGroups[mat.id];
          const item = {
            id: note.id,
            titre: note.sequence ? note.sequence.titre : `${note.type === 'TD' ? 'TD' : 'Devoir'} - Saisie du ${new Date(note.dateSaisie).toLocaleDateString('fr-FR')}`,
            note: Number(note.valeur),
            coef: note.type === 'EXAMEN' ? 3 : 1
          };

          if (note.type === 'EXAMEN') {
            group.examen = {
              note: Number(note.valeur),
              coef: 3,
              date: note.dateSaisie ? new Date(note.dateSaisie).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
            };
          } else if (note.type === 'TD') {
            group.tds.push(item);
          } else {
            group.devoirs.push(item);
          }
        });

        // Compute status for each course
        const processed = Object.values(matiereGroups).map(course => {
          const avg = calculateCourseAverage(course);
          let status = "En cours";
          if (avg !== null) {
            status = avg >= 10 ? "Validé" : "Rattrapage";
          }
          return {
            ...course,
            statut: status
          };
        });

        setGradesData(processed);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(err.message || "Impossible de charger vos notes.");
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Toggle expand/collapse card
  const toggleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  // Filter courses
  const filteredCourses = gradesData.filter((course) => {
    if (filterStatut === "Tous") return true;
    return course.statut === filterStatut;
  });

  // Calculate semester average from completed modules
  const completedCourses = gradesData.filter(c => c.statut !== "En cours");
  const semesterAverage = completedCourses.length > 0 
    ? Math.round((completedCourses.reduce((acc, course) => acc + (calculateCourseAverage(course) || 0), 0) / completedCourses.length) * 100) / 100
    : 0;

  // Calculate ECTS credits
  const totalEcts = gradesData.reduce((acc, c) => acc + c.ects, 0);
  const validatedEcts = gradesData
    .filter(c => c.statut === "Validé")
    .reduce((acc, c) => acc + c.ects, 0);

  const handleDownloadBulletin = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast("Votre bulletin a été généré et téléchargé dans vos documents.", "success");
      setShowModalBulletin(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de vos notes et relevés...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[5%] sm:px-[10%] py-10 animate-fadeIn">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mes Notes & Résultats</h1>
          <p className="text-xs text-slate-500 font-medium">Consultez vos relevés de notes et le détail de vos évaluations.</p>
        </div>
        
        {/* DOWNLOAD BULLETIN BUTTON */}
        <button
          onClick={() => setShowModalBulletin(true)}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition duration-200"
        >
          <FiFileText className="w-4 h-4" />
          Obtenir le Bulletin PDF
        </button>
      </div>

      {/* DASHBOARD STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* GPA CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-orange-50 text-orange-500 rounded-xl">
            <FiTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Moyenne Générale</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-800">{semesterAverage}</span>
              <span className="text-xs text-slate-400 font-bold">/ 20</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100 uppercase tracking-wide inline-block mt-1">
              Mention Assez Bien
            </span>
          </div>
        </div>

        {/* ECTS PROGRESS CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Crédits ECTS acquis</span>
              <span className="text-xl font-black text-slate-800 mt-0.5">{validatedEcts} <span className="text-xs text-slate-400 font-bold">/ {totalEcts} ECTS</span></span>
            </div>
            <span className="text-xs font-black text-orange-500">{Math.round((validatedEcts / totalEcts) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(validatedEcts / totalEcts) * 100}%` }}
            />
          </div>
        </div>

        {/* SUMMARY VALIDATED MODULES */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-500 rounded-xl">
            <FiBook className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules Validés</span>
            <span className="text-2xl font-black text-slate-800 block mt-0.5">
              {gradesData.filter(c => c.statut === "Validé").length} <span className="text-xs text-slate-400 font-bold">/ {gradesData.length}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {gradesData.filter(c => c.statut === "En cours").length} module(s) en cours d'évaluation
            </span>
          </div>
        </div>

      </div>

      {/* FILTER BUTTONS */}
      <div className="flex border-b border-slate-100 pb-4 mb-6 overflow-x-auto gap-2">
        {["Tous", "Validé", "Rattrapage", "En cours"].map((statut) => (
          <button
            key={statut}
            onClick={() => setFilterStatut(statut)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap border
              ${filterStatut === statut 
                ? "bg-slate-800 text-white border-slate-800 shadow" 
                : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-800"
              }`}
          >
            {statut === "Tous" ? "Tous les modules" : statut}
          </button>
        ))}
      </div>

      {/* LIST OF MODULES */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const average = calculateCourseAverage(course);
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md
                  ${isExpanded ? 'border-orange-200 ring-1 ring-orange-500/5' : 'border-slate-100'}`}
              >
                {/* CARD HEADER */}
                <div 
                  onClick={() => toggleExpand(course.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Module {course.id} • {course.ects} ECTS</span>
                    <h2 className="text-sm font-bold text-slate-800 mt-1 hover:text-orange-500 transition truncate">{course.titre}</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Enseignant : {course.tuteur}</p>
                  </div>

                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    {/* Course average display */}
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Moyenne</span>
                      {average !== null ? (
                        <span className={`text-base font-black ${average >= 10 ? "text-slate-800" : "text-rose-600"}`}>
                          {average} <span className="text-xs text-slate-400 font-bold">/ 20</span>
                        </span>
                      ) : (
                        <span className="text-sm font-black text-slate-400">--</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {course.statut === "Validé" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
                          <FiCheck className="w-3 h-3" />
                          Validé
                        </span>
                      )}
                      {course.statut === "Rattrapage" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg animate-pulse">
                          <FiXCircle className="w-3 h-3" />
                          Rattrapage
                        </span>
                      )}
                      {course.statut === "En cours" && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                          En cours
                        </span>
                      )}
                    </div>

                    {/* Arrow Toggle */}
                    <div className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400">
                      {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* CARD DETAILS BREAKDOWN */}
                {isExpanded && (
                  <div className="bg-slate-50/50 border-t border-slate-100 p-6 animate-slideDown">
                    
                    {course.statut === "En cours" ? (
                      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
                        <FiInfo className="text-blue-500 w-5 h-5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">Calcul de la moyenne indisponible</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Les notes de ce module n'ont pas encore été intégralement publiées par l'enseignant.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT COLUMN: EVALUATIONS LIST */}
                        <div className="lg:col-span-2 space-y-4">
                          
                          {/* TD GRADINGS */}
                          {course.tds?.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Travaux Dirigés (TD)</h4>
                              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                                      <th className="p-3">Évaluation</th>
                                      <th className="p-3 text-center">Coefficient</th>
                                      <th className="p-3 text-right">Note</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {course.tds.map((td) => (
                                      <tr key={td.id} className="text-slate-600">
                                        <td className="p-3 font-semibold text-slate-700">{td.titre}</td>
                                        <td className="p-3 text-center font-medium">coef {td.coef}</td>
                                        <td className="p-3 text-right font-bold text-slate-800">{td.note ?? "--"} <span className="text-[9px] text-slate-400">/20</span></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* DEVOIR GRADINGS */}
                          {course.devoirs?.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Devoirs de Maison</h4>
                              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                                      <th className="p-3">Évaluation</th>
                                      <th className="p-3 text-center">Coefficient</th>
                                      <th className="p-3 text-right">Note</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {course.devoirs.map((dev) => (
                                      <tr key={dev.id} className="text-slate-600">
                                        <td className="p-3 font-semibold text-slate-700">{dev.titre}</td>
                                        <td className="p-3 text-center font-medium">coef {dev.coef}</td>
                                        <td className="p-3 text-right font-bold text-slate-800">{dev.note ?? "--"} <span className="text-[9px] text-slate-400">/20</span></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* RIGHT COLUMN: EXAM & FORMULA */}
                        <div className="space-y-4">
                          
                          {/* EXAM CARD */}
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Examen Final</h4>
                            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                              <div>
                                <h5 className="text-xs font-bold text-slate-800">Note de l'examen</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Passé le : {course.examen?.date}</p>
                              </div>
                              <div className="text-right">
                                <span className={`text-base font-black block ${course.examen?.note >= 10 ? "text-orange-500" : "text-rose-600"}`}>
                                  {course.examen?.note} <span className="text-xs text-slate-400 font-bold">/ 20</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">coef {course.examen?.coef}</span>
                              </div>
                            </div>
                          </div>

                          {/* FORMULA & WARNING INFO */}
                          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <FiPercent className="text-orange-500" />
                              Pondération & Calcul
                            </h4>
                            <div className="mt-3 space-y-2 text-[11px] text-slate-500 leading-normal">
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span>Note de Contrôle Continu (TD)</span>
                                <strong className="text-slate-700">30%</strong>
                              </div>
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span>Note de Devoir</span>
                                <strong className="text-slate-700">30%</strong>
                              </div>
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span>Note d'Examen Table</span>
                                <strong className="text-slate-700">40%</strong>
                              </div>
                            </div>
                            {course.statut === "Rattrapage" && (
                              <div className="mt-4 p-2.5 bg-rose-50/50 border border-rose-100 text-[10px] text-rose-700 rounded-lg font-medium">
                                <strong className="font-bold">Remarque :</strong> La moyenne de ce module est inférieure à 10/20. Vous êtes admis à passer la session de rattrapage programmée ultérieurement.
                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border rounded-2xl">
            <FiXCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-400 text-sm mt-2 font-semibold">Aucun module ne correspond au filtre.</p>
          </div>
        )}
      </div>

      {/* MODAL: BULLETIN PREVIEW */}
      {showModalBulletin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FiFileText className="text-orange-500" />
                Bulletin de Notes Officiel (Aperçu)
              </h3>
              <button 
                onClick={() => setShowModalBulletin(false)}
                className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Simulated Relevé de notes */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              <div className="bg-white border border-slate-200/80 shadow-md p-8 max-w-2xl mx-auto rounded-lg text-slate-800 relative font-serif">
                
                {/* Watermark logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                  <span className="text-9xl font-black rotate-45 select-none">UNCHK</span>
                </div>

                {/* UNCHK Official Heading */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div className="text-left font-sans">
                    <h4 className="text-sm font-extrabold tracking-tight text-blue-700">UNIVERSITÉ NUMÉRIQUE</h4>
                    <h4 className="text-[10px] font-bold text-slate-900 leading-tight">CHEIKH HAMIDOU KANE</h4>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Sénégal • Service des examens</p>
                  </div>
                  <div className="text-right font-sans text-[8px] text-slate-400">
                    <p>Année Académique : 2025/2026</p>
                    <p>Semestre : Semestre 2 (M1)</p>
                    <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center my-6">
                  <h3 className="text-base font-extrabold underline tracking-wide">RELEVÉ DE NOTES ET RÉSULTATS</h3>
                  <p className="text-[10px] italic text-slate-500 mt-0.5 font-sans">(Document provisoire en attente de jury officiel)</p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-slate-50 p-4 rounded border mb-6">
                  <div>
                    <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Identité de l'Étudiant</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{studentName}</p>
                    <p className="mt-1">N° Étudiant : <strong className="font-semibold">UNCHK-2025-4819</strong></p>
                    <p>Filière : <strong className="font-semibold font-sans">Ingénierie Logicielle (M1)</strong></p>
                  </div>
                  <div className="text-right sm:text-left sm:pl-6 border-l border-slate-200">
                    <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Synthèse des résultats</p>
                    <p className="mt-1">Moyenne Générale : <strong className="text-slate-800 font-bold">{semesterAverage} / 20</strong></p>
                    <p>Crédits ECTS acquis : <strong className="text-slate-800 font-bold">{validatedEcts} / {totalEcts}</strong></p>
                    <p>Résultat d'admission : <strong className="text-emerald-600 font-extrabold">ADMIS (SOUS RÉSERVE)</strong></p>
                  </div>
                </div>

                {/* Grades Table */}
                <table className="w-full text-left text-[11px] border-collapse font-sans">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-[10px] font-black uppercase text-slate-500">
                      <th className="py-2">Module / Cours</th>
                      <th className="py-2 text-center">Crédits</th>
                      <th className="py-2 text-center">Moyenne</th>
                      <th className="py-2 text-right">Décision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gradesData.map((course) => {
                      const avg = calculateCourseAverage(course);
                      return (
                        <tr key={course.id}>
                          <td className="py-2 font-medium text-slate-700">{course.titre}</td>
                          <td className="py-2 text-center text-slate-500">{course.ects}</td>
                          <td className="py-2 text-center font-bold">{avg !== null ? `${avg} /20` : "--"}</td>
                          <td className="py-2 text-right">
                            {course.statut === "Validé" && <span className="text-emerald-600 font-bold">Admis</span>}
                            {course.statut === "Rattrapage" && <span className="text-rose-600 font-bold">Rattrapage</span>}
                            {course.statut === "En cours" && <span className="text-blue-500 font-bold">En cours</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Footer Stamp & Sign */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end font-sans">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400">Le Directeur des Études</p>
                    <div className="h-10 my-1 flex items-center justify-center">
                      <span className="text-[10px] text-slate-300 font-serif italic">Signature & Cachet</span>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">UNCHK Direction Académique</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setShowModalBulletin(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition"
                disabled={downloading}
              >
                Fermer
              </button>
              <button 
                onClick={() => showToast("Simulation de l'impression...", "info")}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                disabled={downloading}
              >
                <FiPrinter />
                <span>Imprimer</span>
              </button>
              <button 
                onClick={handleDownloadBulletin}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 transition"
                disabled={downloading}
              >
                {downloading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Génération...
                  </span>
                ) : (
                  <>
                    <FiDownload />
                    <span>Télécharger le PDF</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
