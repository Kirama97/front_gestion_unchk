import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../../utils/api'
import {
  PiStudent,
  PiChalkboardTeacher,
  PiBriefcase,        
  PiCalendarCheck,
  PiCalendarDotsLight ,
  PiNotebook,
  PiHouseLine,
  PiGearSix,
  PiGraduationCap,
  PiBooks,
  PiUserPlus,
  PiListBullets,
  PiUsersFour,
  PiLink,
  PiPlusCircle,
  PiCalendarPlus,
  PiTable,
  PiPencilLine,
  PiFolderOpen,
  PiCaretRight,
  PiCaretDown,
} from 'react-icons/pi'



const FiliereItem = ({ filiere }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-md hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition-all"
      >
        <span className="flex items-center gap-1.5">
          <PiFolderOpen className="text-sm shrink-0" />
          {filiere.label}
        </span>
        {open ? <PiCaretDown className="text-xs" /> : <PiCaretRight className="text-xs" />}
      </button>

      {open && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-orange-100 pl-2 mt-0.5">
          <NavLink to={`/admin/etudiants/filiere/${filiere.id}`} icon={<PiListBullets />} label="Liste des étudiants" />
          <NavLink to={`/admin/etudiants/filiere/${filiere.id}/ajouter`} icon={<PiUserPlus />} label="Ajouter un étudiant" />
          <NavLink to={`/admin/etudiants/filiere/${filiere.id}/notes`} icon={<PiNotebook />} label="Notes de la filière" />
          <NavLink to={`/admin/etudiants/filiere/${filiere.id}/planning`} icon={<PiCalendarDotsLight  />} label="Emploie du temps" />
        </div>
      )}
    </div>
  )
}


const PromoItem = ({ promo }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-md hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all font-medium"
      >
        <span className="flex items-center gap-1.5">
          <PiGraduationCap className="text-sm shrink-0" />
          {promo.label}
        </span>
        {open ? <PiCaretDown className="text-xs" /> : <PiCaretRight className="text-xs" />}
      </button>

      {open && (
        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-orange-100 pl-2 mt-0.5">
          {promo.filieres.map((f) => (
            <FiliereItem key={f.id} filiere={f} />
          ))}
        </div>
      )}
    </div>
  )
}


const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-1.5 text-[10px] py-1 px-2 rounded-md text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
  >
    <span className="text-sm shrink-0">{icon}</span>
    {label}
  </Link>
)


const SideSection = ({ icon: Icon, label, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className={`text-sm font-medium flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
          open
            ? 'text-orange-600 bg-orange-50'
            : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50/50'
        }`}
      >
        <span className="flex items-center gap-2">
          <Icon className="text-base shrink-0" />
          <span>{label}</span>
        </span>
        {open
          ? <PiCaretDown className="text-sm" />
          : <PiCaretRight className="text-sm" />}
      </button>

      {open && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-orange-100 pl-3">
          {children}
        </div>
      )}
    </div>
  )
}


const AsideAdmin = () => {
  const [promos, setPromos] = useState([])

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promotionsList = await apiGet('/api/academique/promotions')
        const filieresList = await apiGet('/api/academique/filieres')
        
        const mapped = promotionsList.map(p => ({
          id: p.id,
          label: p.nom,
          filieres: filieresList.map(f => ({
            id: f.id,
            label: f.code
          }))
        }));
        setPromos(mapped);
      } catch (err) {
        console.error('Error fetching promos for sidebar:', err);
      }
    };
    fetchPromos();
  }, []);

  return (
    <aside className="aside_admin w-64 h-[92vh]  bg-white border-r border-slate-200 p-4 flex flex-col gap-4 max-md:hidden overflow-y-auto">

      {}
      <div className="px-2 py-1 border-b border-slate-100 pb-4">
        <p className="text-base font-bold text-orange-600">Admin Panel</p>
        <p className="text-[10px] text-slate-400">Gestion académique</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
          Menu Principal
        </span>

        {}
        <SideSection icon={PiStudent} label="Étudiants">
          {promos.map((promo) => (
            <PromoItem key={promo.id} promo={promo} />
          ))}
          <NavLink to="/admin/promotions" icon={<PiPlusCircle />} label="Nouvelle promo" />
        </SideSection>

        {}
        <SideSection icon={PiChalkboardTeacher} label="Enseignants">
          <NavLink to="/admin/enseignants" icon={<PiListBullets />} label="Liste des enseignants" />
          <NavLink to="/admin/enseignants/ajouter" icon={<PiUserPlus />} label="Ajouter un enseignant" />
          <NavLink to="/admin/enseignants/matieres" icon={<PiBooks />} label="Matières assignées" />
        </SideSection>

        {}
       <SideSection icon={PiBriefcase} label="Tuteurs">
          <NavLink to="/admin/tuteurs" icon={<PiListBullets />} label="Liste des tuteurs" />
          <NavLink to="/admin/tuteurs/ajouter" icon={<PiUserPlus />} label="Ajouter un tuteur" />
          <NavLink to="/admin/tuteurs/affectations" icon={<PiLink />} label="Affectations étudiants" />
          <NavLink to="/admin/tuteurs/groupes" icon={<PiUsersFour />} label="Groupes de suivi" />
        </SideSection>

        {}
        <SideSection icon={PiCalendarCheck} label="Réunion / Planning">
          <NavLink to="/admin/reunions" icon={<PiListBullets />} label="Calendrier des réunions" />
          <NavLink to="/admin/reunions/nouvelle" icon={<PiCalendarPlus />} label="Planifier une réunion" />
          <NavLink to="/admin/planning" icon={<PiTable />} label="Planning général" />
        </SideSection>

        {}
        <SideSection icon={PiNotebook} label="Notes & Évaluations">
          <NavLink to="/admin/notes" icon={<PiTable />} label="Tableau des notes" />
          <NavLink to="/admin/notes/saisir" icon={<PiPencilLine />} label="Saisir des notes" />
          <NavLink to="/admin/notes/bulletins" icon={<PiFolderOpen />} label="Bulletins de notes" />
        </SideSection>

        {}
        <SideSection icon={PiFolderOpen} label="Admin & Com">
          <NavLink to="/admin/courriers" icon={<PiListBullets />} label="Courriers" />
          <NavLink to="/admin/notes-service" icon={<PiListBullets />} label="Notes de service" />
          <NavLink to="/admin/budget" icon={<PiListBullets />} label="Budget" />
          <NavLink to="/admin/comptes-rendus" icon={<PiListBullets />} label="Comptes Rendus" />
          <NavLink to="/admin/notifications" icon={<PiListBullets />} label="Notifications" />
        </SideSection>
      </div>

      {}
      <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
          Accès rapide
        </span>
        <Link
          to="/admin"
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all"
        >
          <PiHouseLine className="text-base shrink-0" /> Tableau de bord
        </Link>
        <Link
          to="/admin/parametres"
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all"
        >
          <PiGearSix className="text-base shrink-0" /> Paramètres
        </Link>
      </div>
    </aside>
  )
}

export default AsideAdmin