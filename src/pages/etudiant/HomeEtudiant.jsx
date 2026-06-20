import React, { useState, useEffect } from 'react'
import BanniereEtudiant from '../../components/etudant/BanniereEtudiant'
import ProchainCours from '../../components/etudant/ProchainCours'
import ProfilAcademique from '../../components/etudant/ProfilAcademique'
import AccesRapide from '../../components/etudant/AccesRapide'
import InfoBoxEtudiant from './../../components/etudant/InfoBoxEtudiant';
import { apiGet } from '../../utils/api'

const HomeEtudiant = () => {
  const [profile, setProfile] = useState(null);
  const [prochainCours, setProchainCours] = useState(null);
  const [latestAnnonce, setLatestAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProchainCours = (edtList) => {
    if (!edtList || edtList.length === 0) return null;
    
    const days = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
    const now = new Date();
    const currentDayIndex = now.getDay(); 
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closestClass = null;
    let minDiff = Infinity;

    edtList.forEach(item => {
      const classDayIndex = days.indexOf(item.jourSemaine?.toUpperCase());
      if (classDayIndex === -1) return;

      const [startH, startM] = (item.heureDebut || "00:00").split(':').map(Number);
      const classStartMinutes = startH * 60 + startM;

      let daysDiff = classDayIndex - currentDayIndex;
      if (daysDiff < 0) {
        daysDiff += 7;
      }

      let diffMinutes = 0;
      if (daysDiff === 0) {
        if (classStartMinutes > currentMinutes) {
          diffMinutes = classStartMinutes - currentMinutes;
        } else {
          diffMinutes = (classStartMinutes - currentMinutes) + (7 * 24 * 60);
        }
      } else {
        diffMinutes = (daysDiff * 24 * 60) + (classStartMinutes - currentMinutes);
      }

      if (diffMinutes < minDiff) {
        minDiff = diffMinutes;
        closestClass = item;
      }
    });

    if (!closestClass) return null;

    const cleanTime = (t) => t ? t.substring(0, 5) : '';
    const timeStr = `${cleanTime(closestClass.heureDebut)} - ${cleanTime(closestClass.heureFin)}`;
    
    let statusStr = "";
    const diffHours = Math.floor(minDiff / 60);
    const diffMins = minDiff % 60;
    
    if (minDiff < 60) {
      statusStr = `Dans ${diffMins} min`;
    } else if (minDiff < 24 * 60) {
      statusStr = `Dans ${diffHours}h ${diffMins > 0 ? diffMins + 'm' : ''}`;
    } else {
      statusStr = `Prévu le ${closestClass.jourSemaine.toLowerCase()}`;
    }

    const teacherName = closestClass.cours?.enseignant 
      ? `${closestClass.cours.enseignant.prenom} ${closestClass.cours.enseignant.nom}`
      : "M. Ndiaye";

    return {
      subject: closestClass.matiere || (closestClass.cours?.matiere?.nom) || "Cours",
      teacher: teacherName,
      time: timeStr,
      room: closestClass.salle || "En ligne",
      status: statusStr
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, edtData, annoncesData] = await Promise.all([
          apiGet('/api/etudiant/me'),
          apiGet('/api/emploi-du-temps/me'),
          apiGet('/api/annonces')
        ]);

        setProfile(profileData);
        
        const next = getProchainCours(edtData);
        setProchainCours(next);

        if (annoncesData && annoncesData.length > 0) {
          setLatestAnnonce(annoncesData[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading student portal home data:", err);
        setError(err.message || "Erreur lors du chargement des informations du portail.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Chargement de votre portail étudiant...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  const user = {
    email: profile?.utilisateur?.email || '',
    prenom: profile?.utilisateur?.prenom || '',
    nom: profile?.utilisateur?.nom || ''
  };

  return (
    <div className='w-full'>
         {}
         <BanniereEtudiant user={user} />

         {}
         <div className="section2 px-4 sm:px-8 lg:px-12 py-10 bg-slate-50">

            {}
            <ProchainCours prochainCours={prochainCours} />

            {}
            <ProfilAcademique profile={profile} />

            {}
            <AccesRapide />

            {}
            <InfoBoxEtudiant annonce={latestAnnonce} />

         </div>
      
    </div>
  )
}

export default HomeEtudiant
