import React, { useState, useEffect } from 'react'
import CardCours from './CardCours';
import { apiGet } from '../../utils/api';

const LesCours = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/api/cours/me');
        const formatted = data.map((c, index) => ({
          id: c.id,
          image: defaultImages[index % defaultImages.length],
          titre: c.matiere?.nom || 'Cours sans titre',
          description: c.matiere?.description || 'Pas de description disponible pour ce cours.',
          tuteur: c.enseignant ? `${c.enseignant.prenom} ${c.enseignant.nom}` : 'Administration',
          duree: '30h',
          progress: 50
        }));
        setCourses(formatted);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student courses:', err);
        setError(err.message || 'Impossible de charger vos cours.');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[30vh] flex items-center justify-center">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">Chargement de vos cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[30vh] flex items-center justify-center px-4">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
        <p className="text-slate-400 text-sm font-semibold">Vous n'avez aucun cours programmé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
      {courses.map((coursItem) => (
        <CardCours key={coursItem.id} coursItem={coursItem} />
      ))}
    </div>
  )
}

export default LesCours
