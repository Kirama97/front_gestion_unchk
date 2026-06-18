import React, { useRef , useState} from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { CiMenuBurger } from "react-icons/ci";
import NavbarAdmin from './../commun/NavbarAdmin';
import AsideAdmin from './../../components/admin/AsideAdmin';

import { 

  FiSearch, 
  FiBell, 
  FiMessageSquare, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiUser, 
  FiSettings, 
  FiCalendar, 
  FiBookOpen, 
  FiAward, 
  FiHelpCircle,
  FiFileText
} from 'react-icons/fi'


const DashboardAdmin = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
 
 


  return (
    <div className="h-[100vh] bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <NavbarAdmin></NavbarAdmin>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AsideAdmin></AsideAdmin>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-2 h-screen overflow-y-auto">
          <div className="w-full mx-auto  rounded-2xl   p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardAdmin
