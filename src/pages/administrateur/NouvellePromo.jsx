import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';
import { 
  FiFolderPlus, 
  FiTrash2, 
  FiEdit3, 
  FiCheck, 
  FiX, 
  FiBookOpen, 
  FiPlus, 
  FiFolder
} from 'react-icons/fi';

const NouvellePromo = () => {
  const [promotions, setPromotions] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newPromoNom, setNewPromoNom] = useState('');
  const [newFiliere, setNewFiliere] = useState({ nom: '', code: '' });

  // Edit states
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [editPromoNom, setEditPromoNom] = useState('');
  const [editingFiliereId, setEditingFiliereId] = useState(null);
  const [editFiliere, setEditFiliere] = useState({ nom: '', code: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [promosList, filieresList] = await Promise.all([
        apiGet('/api/academique/promotions'),
        apiGet('/api/academique/filieres')
      ]);
      setPromotions(promosList);
      setFilieres(filieresList);
      setLoading(false);
    } catch (err) {
      console.error('Error loading academic details:', err);
      setError('Erreur lors du chargement des promotions et filières.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ──────────────────── Promotions Handlers ────────────────────

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!newPromoNom.trim()) return;
    try {
      await apiPost('/api/academique/promotions', { nom: newPromoNom });
      setNewPromoNom('');
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la création de la promotion.');
    }
  };

  const handleStartEditPromo = (promo) => {
    setEditingPromoId(promo.id);
    setEditPromoNom(promo.nom);
  };

  const handleSavePromo = async (id) => {
    if (!editPromoNom.trim()) return;
    try {
      await apiPut(`/api/academique/promotions/${id}`, { nom: editPromoNom });
      setEditingPromoId(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette promotion ? Tous les étudiants et classes associés risquent d'être impactés.")) return;
    try {
      // Direct call to verify deletion behavior
      await fetch(`http://localhost:8080/api/academique/promotions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  // ──────────────────── Filières Handlers ────────────────────

  const handleCreateFiliere = async (e) => {
    e.preventDefault();
    if (!newFiliere.nom.trim() || !newFiliere.code.trim()) return;
    try {
      await apiPost('/api/academique/filieres', newFiliere);
      setNewFiliere({ nom: '', code: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la création de la filière.');
    }
  };

  const handleStartEditFiliere = (filiere) => {
    setEditingFiliereId(filiere.id);
    setEditFiliere({ nom: filiere.nom, code: filiere.code });
  };

  const handleSaveFiliere = async (id) => {
    if (!editFiliere.nom.trim() || !editFiliere.code.trim()) return;
    try {
      await apiPut(`/api/academique/filieres/${id}`, editFiliere);
      setEditingFiliereId(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleDeleteFiliere = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette filière ?")) return;
    try {
      await fetch(`http://localhost:8080/api/academique/filieres/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de la structure...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Promotions & Filières</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Créez et configurez la structure académique de l'établissement.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: PROMOTIONS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
            <FiFolder className="text-orange-500 w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Promotions</h2>
          </div>

          {/* Form to add promo */}
          <form onSubmit={handleCreatePromo} className="flex gap-2 mb-2">
            <input 
              type="text" 
              placeholder="Ex: Promotion 10"
              value={newPromoNom}
              onChange={e => setNewPromoNom(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <button 
              type="submit" 
              className="flex items-center gap-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
            >
              <FiPlus />
              <span>Ajouter</span>
            </button>
          </form>

          {/* Promotions list */}
          <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-1">
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between border border-slate-100 p-3.5 rounded-xl hover:bg-slate-50/50 transition">
                  {editingPromoId === promo.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={editPromoNom}
                        onChange={e => setEditPromoNom(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button onClick={() => handleSavePromo(promo.id)} className="text-green-600 hover:text-green-700 p-1"><FiCheck className="w-4 h-4" /></button>
                      <button onClick={() => setEditingPromoId(null)} className="text-slate-400 hover:text-slate-500 p-1"><FiX className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-slate-700">{promo.nom}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStartEditPromo(promo)} className="text-slate-400 hover:text-orange-500 p-1 transition"><FiEdit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeletePromo(promo.id)} className="text-slate-400 hover:text-red-500 p-1 transition"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">Aucune promotion enregistrée.</p>
            )}
          </div>
        </div>

        {/* PANEL 2: FILIERES */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-1">
            <FiBookOpen className="text-orange-500 w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filières</h2>
          </div>

          {/* Form to add filiere */}
          <form onSubmit={handleCreateFiliere} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <input 
              type="text" 
              placeholder="Code (Ex: IDA)"
              value={newFiliere.code}
              onChange={e => setNewFiliere({...newFiliere, code: e.target.value})}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <input 
              type="text" 
              placeholder="Nom (Ex: Informatique)"
              value={newFiliere.nom}
              onChange={e => setNewFiliere({...newFiliere, nom: e.target.value})}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <button 
              type="submit" 
              className="flex items-center justify-center gap-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
            >
              <FiPlus />
              <span>Ajouter</span>
            </button>
          </form>

          {/* Filières list */}
          <div className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-1">
            {filieres.length > 0 ? (
              filieres.map((fil) => (
                <div key={fil.id} className="flex items-center justify-between border border-slate-100 p-3.5 rounded-xl hover:bg-slate-50/50 transition">
                  {editingFiliereId === fil.id ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={editFiliere.code}
                        onChange={e => setEditFiliere({...editFiliere, code: e.target.value})}
                        className="w-20 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input 
                        type="text" 
                        value={editFiliere.nom}
                        onChange={e => setEditFiliere({...editFiliere, nom: e.target.value})}
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSaveFiliere(fil.id)} className="text-green-600 hover:text-green-700 p-1"><FiCheck className="w-4 h-4" /></button>
                        <button onClick={() => setEditingFiliereId(null)} className="text-slate-400 hover:text-slate-500 p-1"><FiX className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{fil.code}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{fil.nom}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStartEditFiliere(fil)} className="text-slate-400 hover:text-orange-500 p-1 transition"><FiEdit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteFiliere(fil.id)} className="text-slate-400 hover:text-red-500 p-1 transition"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">Aucune filière enregistrée.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NouvellePromo;
