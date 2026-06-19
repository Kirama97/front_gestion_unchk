import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet, apiPost, apiDelete } from '../../utils/api';
import { 
  FiUserPlus, 
  FiTrash2, 
  FiSearch, 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiBriefcase 
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const Etudiants = () => {
  const { showToast } = useToast();
  const { filiereId } = useParams();
  const [etudiants, setEtudiants] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: 'Passer123',
    ine: '',
    dateNaissance: '',
    filiere: '',
    promo: '',
    niveauEtude: 'Licence 1',
    adresse: '',
    genre: 'Masculin',
    telephone: '',
    anneeDebut: new Date().getFullYear(),
    anneeSortie: new Date().getFullYear() + 3,
    classeId: '',
    filiereId: '',
    promotionId: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [etudList, promos, fils, cls] = await Promise.all([
        apiGet('/api/etudiants'),
        apiGet('/api/academique/promotions'),
        apiGet('/api/academique/filieres'),
        apiGet('/api/academique/classes')
      ]);
      setEtudiants(etudList);
      setPromotions(promos);
      setFilieres(fils);
      setClasses(cls);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin student directory:', err);
      setError('Erreur lors du chargement de l\'annuaire étudiant.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.ine) {
      showToast("Veuillez remplir les informations obligatoires (Nom, Prénom, Email, INE).", "warning");
      return;
    }

    try {
      // Find selected names to fill text columns
      const selectedFiliereObj = filieres.find(f => f.id === Number(form.filiereId));
      const selectedPromoObj = promotions.find(p => p.id === Number(form.promotionId));

      const payload = {
        ...form,
        filiere: selectedFiliereObj ? selectedFiliereObj.nom : form.filiere,
        promo: selectedPromoObj ? selectedPromoObj.nom : form.promo,
        classeId: form.classeId ? Number(form.classeId) : null,
        filiereId: form.filiereId ? Number(form.filiereId) : null,
        promotionId: form.promotionId ? Number(form.promotionId) : null,
        anneeDebut: Number(form.anneeDebut),
        anneeSortie: Number(form.anneeSortie)
      };

      await apiPost('/api/etudiants', payload);
      showToast("L'étudiant a été créé avec succès.", "success");
      setShowForm(false);
      // Reset form
      setForm({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: 'Passer123',
        ine: '',
        dateNaissance: '',
        filiere: '',
        promo: '',
        niveauEtude: 'Licence 1',
        adresse: '',
        genre: 'Masculin',
        telephone: '',
        anneeDebut: new Date().getFullYear(),
        anneeSortie: new Date().getFullYear() + 3,
        classeId: '',
        filiereId: '',
        promotionId: ''
      });
      loadData();
    } catch (err) {
      console.error('Error creating student:', err);
      showToast(err.message || "Erreur lors de la création de l'étudiant.", "error");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet étudiant ? Cette action est irréversible.")) return;
    try {
      await fetch(`http://localhost:8080/api/etudiants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      });
      showToast("L'étudiant a été supprimé avec succès.", "success");
      loadData();
    } catch (err) {
      console.error('Error deleting student:', err);
      showToast(err.message || 'Erreur lors de la suppression.', "error");
    }
  };

  // Filter students based on search term and filiereId
  const filteredEtudiants = etudiants.filter((etud) => {
    if (filiereId && etud.filiereObj && Number(etud.filiereObj.id) !== Number(filiereId)) return false;
    const userObj = etud.utilisateur || {};
    const searchString = `${userObj.prenom || ''} ${userObj.nom || ''} ${userObj.email || ''} ${etud.ine || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de la liste...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Étudiants</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Enregistrez de nouveaux étudiants et gérez leurs classes.</p>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiUserPlus />
          <span>Inscrire un Étudiant</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, prénom, email ou INE..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">Identifiant (INE)</th>
                <th className="p-4">Nom Complet</th>
                <th className="p-4">Email</th>
                <th className="p-4">Filière / Promo</th>
                <th className="p-4">Classe</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEtudiants.length > 0 ? (
                filteredEtudiants.map((etud) => {
                  const userObj = etud.utilisateur || {};
                  return (
                    <tr key={etud.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono font-bold text-slate-600">{etud.ine}</td>
                      <td className="p-4 font-bold text-slate-800">{userObj.prenom} {userObj.nom}</td>
                      <td className="p-4 text-slate-500">{userObj.email}</td>
                      <td className="p-4 text-slate-500">{etud.filiere} ({etud.promo})</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {etud.classe ? etud.classe.nom : 'Non affecté'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteStudent(etud.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 transition"
                          title="Supprimer l'étudiant"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 italic">Aucun étudiant trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STUDENT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FiUserPlus className="text-orange-500" />
                Inscrire un nouvel Étudiant
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable Form */}
            <form onSubmit={handleCreateStudent} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    placeholder="Ex: Diene"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={form.nom}
                    onChange={e => setForm({...form, nom: e.target.value})}
                    placeholder="Ex: Thiam"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Institutionnel *</label>
                  <input 
                    type="email" 
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="Ex: diene.thiam@unchk.edu.sn"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identifiant (INE) *</label>
                  <input 
                    type="text" 
                    required
                    value={form.ine}
                    onChange={e => setForm({...form, ine: e.target.value})}
                    placeholder="Ex: INE-2026-9876"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mots de passe par défaut</label>
                  <input 
                    type="password" 
                    value={form.motDePasse}
                    onChange={e => setForm({...form, motDePasse: e.target.value})}
                    placeholder="Par défaut: Passer123"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date de Naissance</label>
                  <input 
                    type="date" 
                    value={form.dateNaissance}
                    onChange={e => setForm({...form, dateNaissance: e.target.value})}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotion</label>
                  <select 
                    value={form.promotionId}
                    onChange={e => setForm({...form, promotionId: e.target.value})}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Sélectionner</option>
                    {promotions.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filière</label>
                  <select 
                    value={form.filiereId}
                    onChange={e => setForm({...form, filiereId: e.target.value})}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Sélectionner</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classe</label>
                  <select 
                    value={form.classeId}
                    onChange={e => setForm({...form, classeId: e.target.value})}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Sélectionner</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
                  <input 
                    type="text" 
                    value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="Ex: +221 77 123 45 67"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Genre</label>
                  <select 
                    value={form.genre}
                    onChange={e => setForm({...form, genre: e.target.value})}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adresse</label>
                <input 
                  type="text" 
                  value={form.adresse}
                  onChange={e => setForm({...form, adresse: e.target.value})}
                  placeholder="Ex: Dakar, Sénégal"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  Inscrire l'étudiant
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Etudiants;
