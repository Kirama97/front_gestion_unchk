import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../utils/api';
import { 
  FiUserPlus, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiBriefcase 
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const Enseignants = () => {
  const { showToast } = useToast();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [searchTerm, setSearchTerm] = useState('');

  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: 'Passer123',
    role: 'ENSEIGNANT',
    telephone: '',
    departement: 'Informatique',
    statut: 'Actif'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const personnel = await apiGet('/api/personnel');
      const teachers = personnel.filter(p => p.role === 'enseignant' || p.role === 'ENSEIGNANT');
      setEnseignants(teachers);
      setLoading(false);
    } catch (err) {
      console.error('Error loading teachers list:', err);
      setError('Erreur lors du chargement de la liste des enseignants.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email) {
      showToast("Veuillez remplir les informations obligatoires (Nom, Prénom, Email).", "warning");
      return;
    }

    try {
      const payload = {
        ...form,
        role: 'ENSEIGNANT' 
      };

      await apiPost('/api/personnel', payload);
      showToast("Le compte enseignant a été créé avec succès.", "success");
      setShowForm(false);
      
      setForm({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: 'Passer123',
        role: 'ENSEIGNANT',
        telephone: '',
        departement: 'Informatique',
        statut: 'Actif'
      });
      loadData();
    } catch (err) {
      console.error('Error creating teacher:', err);
      showToast(err.message || "Erreur lors de la création du compte enseignant.", "error");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enseignant ?")) return;
    try {
      await fetch(`http://localhost:8080/api/personnel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      });
      showToast("Enseignant supprimé avec succès.", "success");
      loadData();
    } catch (err) {
      console.error('Error deleting teacher:', err);
      showToast(err.message || 'Erreur lors de la suppression.', "error");
    }
  };

  
  const filteredEnseignants = enseignants.filter((t) => {
    const searchString = `${t.prenom || ''} ${t.nom || ''} ${t.email || ''} ${t.departement || ''}`.toLowerCase();
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
      
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestion des Enseignants</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Enregistrez et gérez les comptes des enseignants de l'établissement.</p>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
        >
          <FiUserPlus />
          <span>Ajouter un Enseignant</span>
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, prénom, email ou département..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* TEACHER TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">Enseignant</th>
                <th className="p-4">Email</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Département</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnseignants.length > 0 ? (
                filteredEnseignants.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{teacher.prenom} {teacher.nom}</td>
                    <td className="p-4 text-slate-500">{teacher.email}</td>
                    <td className="p-4 text-slate-500">{teacher.telephone || 'Non renseigné'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
                        {teacher.departement || 'Général'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 transition"
                        title="Supprimer l'enseignant"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400 italic">Aucun enseignant trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TEACHER FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FiUserPlus className="text-orange-500" />
                Enregistrer un Enseignant
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Form */}
            <form onSubmit={handleCreateTeacher} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    placeholder="Ex: Moussa"
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
                    placeholder="Ex: Ndiaye"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Institutionnel *</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="Ex: moussa.ndiaye@unchk.edu.sn"
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Département</label>
                  <input 
                    type="text" 
                    value={form.departement}
                    onChange={e => setForm({...form, departement: e.target.value})}
                    placeholder="Ex: Informatique"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
                  <input 
                    type="text" 
                    value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="Ex: +221 77 987 65 43"
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

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
                  Enregistrer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Enseignants;
