import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../utils/api';
import { 
  FiFolder, 
  FiUsers, 
  FiBookOpen, 
  FiFileText, 
  FiBell, 
  FiSend, 
  FiPlusCircle,
  FiTrash2
} from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const HomeAdmin = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    promotions: 0,
    filieres: 0,
    etudiants: 0,
    enseignants: 0,
  });
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [newAnnonce, setNewAnnonce] = useState({
    titre: '',
    contenu: '',
    type: 'ACADEMIQUE'
  });
  const [submitting, setSubmitting] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      
      const [promos, filieresList, students, personnel] = await Promise.all([
        apiGet('/api/academique/promotions'),
        apiGet('/api/academique/filieres'),
        apiGet('/api/etudiants'),
        apiGet('/api/personnel')
      ]);

      const teachers = personnel.filter(p => p.role === 'enseignant' || p.role === 'ENSEIGNANT');

      
      const annoncesList = await apiGet('/api/annonces');

      setStats({
        promotions: promos.length,
        filieres: filieresList.length,
        etudiants: students.length,
        enseignants: teachers.length,
      });

      setAnnonces(annoncesList);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setError('Erreur lors du chargement des données du tableau de bord.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePublishAnnonce = async (e) => {
    e.preventDefault();
    if (!newAnnonce.titre || !newAnnonce.contenu) {
      showToast("Veuillez remplir le titre et le contenu.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await apiPost('/api/annonces', {
        titre: newAnnonce.titre,
        contenu: newAnnonce.contenu,
        type: newAnnonce.type
      });
      
      showToast("Annonce publiée avec succès.", "success");
      
      setNewAnnonce({ titre: '', contenu: '', type: 'ACADEMIQUE' });
      
      
      const annoncesList = await apiGet('/api/annonces');
      setAnnonces(annoncesList);
      setSubmitting(false);
    } catch (err) {
      console.error('Error publishing announcement:', err);
      showToast('Impossible de publier l\'annonce.', "error");
      setSubmitting(false);
    }
  };

  const handleDeleteAnnonce = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await fetch(`http://localhost:8080/api/annonces/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}`
        }
      });
      showToast("Annonce supprimée avec succès.", "success");
      // Reload announcements
      const annoncesList = await apiGet('/api/annonces');
      setAnnonces(annoncesList);
    } catch (err) {
      console.error('Error deleting announcement:', err);
      showToast('Erreur lors de la suppression.', "error");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de l'administration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      {}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tableau de Bord Administrateur</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Vue d'ensemble de l'établissement et gestion des annonces.</p>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <FiFolder className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Promotions</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5">{stats.promotions}</span>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl">
            <FiBookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filières</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5">{stats.filieres}</span>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Étudiants</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5">{stats.etudiants}</span>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enseignants</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5">{stats.enseignants}</span>
          </div>
        </div>

      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <FiBell className="text-orange-500 w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Annonces Publiées</h2>
          </div>

          <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-1">
            {annonces.length > 0 ? (
              annonces.map((ann) => (
                <div key={ann.id} className="border border-slate-100 p-4 rounded-xl hover:bg-slate-50/50 transition relative group">
                  <button 
                    onClick={() => handleDeleteAnnonce(ann.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    title="Supprimer l'annonce"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ann.type === 'CHANGEMENT_EDT' ? 'bg-amber-50 text-amber-700' :
                      ann.type === 'ACADEMIQUE' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {ann.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(ann.datePublication).toLocaleString('fr-FR')}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mt-1.5">{ann.titre}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ann.contenu}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-8">Aucune annonce publiée pour le moment.</p>
            )}
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <FiPlusCircle className="text-orange-500 w-5 h-5" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Créer une Annonce</h2>
          </div>

          <form onSubmit={handlePublishAnnonce} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Titre de l'annonce</label>
              <input 
                type="text" 
                placeholder="Ex: Session de rattrapage"
                value={newAnnonce.titre}
                onChange={e => setNewAnnonce({...newAnnonce, titre: e.target.value})}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type d'annonce</label>
              <select 
                value={newAnnonce.type}
                onChange={e => setNewAnnonce({...newAnnonce, type: e.target.value})}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                <option value="ACADEMIQUE">Académique</option>
                <option value="CHANGEMENT_EDT">Changement d'EDT</option>
                <option value="INFO_IMPORTANTE">Information Importante</option>
                <option value="REUNION">Réunion</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contenu</label>
              <textarea 
                rows={4}
                placeholder="Écrivez le message de l'annonce ici..."
                value={newAnnonce.contenu}
                onChange={e => setNewAnnonce({...newAnnonce, contenu: e.target.value})}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow transition duration-200 disabled:opacity-50 cursor-pointer"
            >
              <FiSend />
              <span>{submitting ? 'Publication...' : 'Publier'}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default HomeAdmin;
