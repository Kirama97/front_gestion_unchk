import React, { useState } from 'react'

const PersonnelList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const mockPersonnel = [
    { id: 1, name: "Fatou Diop", email: "fatou.diop@unchk.edu.sn", role: "Administrateur", status: "Actif", dept: "Scolarité" },
    { id: 2, name: "Moussa Ndiaye", email: "moussa.ndiaye@unchk.edu.sn", role: "Enseignant", status: "Actif", dept: "Informatique" },
    { id: 3, name: "Awa Fall", email: "awa.fall@unchk.edu.sn", role: "Tuteur", status: "Actif", dept: "Mathématiques" },
    { id: 4, name: "Ibrahima Diallo", email: "ibrahima.diallo@unchk.edu.sn", role: "Insertion", status: "En congé", dept: "Relations Professionnelles" },
    { id: 5, name: "Khadija Sy", email: "khadija.sy@unchk.edu.sn", role: "Administrateur", status: "Actif", dept: "Ressources Humaines" }
  ]

  const filteredPersonnel = mockPersonnel.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Liste du Personnel</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gérer les membres de l'administration et du corps professoral.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition w-full sm:w-64"
          />
          <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md shadow-orange-500/10 whitespace-nowrap">
            + Ajouter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-bold text-slate-600">Nom complet</th>
              <th className="p-4 text-xs font-bold text-slate-600">Email</th>
              <th className="p-4 text-xs font-bold text-slate-600">Département</th>
              <th className="p-4 text-xs font-bold text-slate-600">Rôle</th>
              <th className="p-4 text-xs font-bold text-slate-600">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-xs font-semibold text-slate-800">{person.name}</td>
                  <td className="p-4 text-xs text-slate-600 font-mono">{person.email}</td>
                  <td className="p-4 text-xs text-slate-600">{person.dept}</td>
                  <td className="p-4 text-xs">
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium text-[10px]">
                      {person.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${
                      person.status === "Actif" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-xs text-slate-400">
                  Aucun membre trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PersonnelList
