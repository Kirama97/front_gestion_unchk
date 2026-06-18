import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { apiPost } from '../../utils/api'

const Login = () => {
   const [loading ,setLoading] = useState(false)
   const [error, setError] = useState("")
   const navigate = useNavigate()
   const [form , setForm] = useState({
     email :  "",
     password :  "",
   })

   const handleLogin = async (e) => {
       e.preventDefault();
       setLoading(true)
       setError("")

       try {
         const response = await apiPost('/api/auth/login', {
           email: form.email,
           password: form.password
         });

         // Store full response including token, email, role, nom, prenom, id in localStorage
         localStorage.setItem("user", JSON.stringify(response));

         // Redirect based on role
         setTimeout(() => {
           setLoading(false)
           if (response.role === "admin") {
             navigate("/admin/accueil")
           } else if (response.role === "etudiant") {
             navigate("/etudiant/accueil")
           } else if (response.role === "enseignant") {
             navigate("/enseignant/accueil") // Kept as is if that was the route
           } else if (response.role === "tuteur") {
             navigate("/tuteur/accueil")
           } else if (response.role === "insertion") {
             navigate("/insertion")
           } else {
             navigate("/")
           }
         }, 800) // slight delay for beautiful loading micro-animation
       } catch (err) {
         setLoading(false)
         setError(err.message || "Email ou mot de passe institutionnel incorrect.")
       }
   } 


  return (
    <div className='w-full h-screen max-sm:px-3 max-h-screen bg-cover bg-center flex items-center justify-center ' style={{backgroundImage: "url('/cas-bg.jpeg')"}}>

        <div className=" w-full max-w-md   bg-white/60 backdrop-blur-lg  rounded-2xl shadow-2xl py-8 px-8 border border-[#cb6f29] border-l-8">
          
           <div className="login_top text-center mt-2 mb-5">
               <h1 className='text-xl font-bold  '>Connexion</h1>
               <p className='text-xs text-neutral mt-1'>Bienvenue ! Connectez-vous à votre compte</p>
           </div>

           {error && (
             <div className="mb-4 text-xs text-red-700 bg-red-100/80 border border-red-300 p-3 rounded-md text-center font-medium backdrop-blur-sm">
               {error}
             </div>
           )}

            {/* form */}
           <form action="" className="" onSubmit={handleLogin}>
              {/* email */}
                <div className="flex flex-col gap-2 mb-3">
                  <label 
                  htmlFor=""
                  className='text-xs font-semibold'
                  >Email</label>
                  <input
                      type="email"
                      value = {form.email}
                      onChange={e => setForm({...form , email:e.target.value}) }
                      placeholder='adresse email institutionnel'
                      className='text-xs px-3 py-3 rounded-md bg-transparent border border-black placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00802D] transition focus:ring-offset-1 '

                    />
                </div>
                {/* mots de passe */}
                <div className="flex flex-col gap-2 mb-2">
                  <label htmlFor=""
                    className='text-xs font-semibold'
                  >Mots de passe</label>
                  <input
                      type="password"
                      value={form.password}
                      onChange = {e => setForm({...form , password:e.target.value})}
                      placeholder='**********'
                      className='text-xs px-3 py-3 rounded-md bg-transparent border border-black placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00802D] transition focus:ring-offset-1 '

                    />
                </div>
                
                {/* password oublier and save  */}
                <div className="flex items-center justify-between text-xs mt-5">
                    <div className="flex items-center gap-3 ">
                        <input type="checkbox" />
                        <p className='text-xs'>Se souvenir de moi</p>
                    </div>
                    <Link to="" className='font-semibold'> Mots de passe oublié ?</Link>

                </div>
                
                  {/* btn submit  */}
                  <button
                    type='submit'
                    disabled={loading}
                    className='mt-5 text-center text-xs w-full bg-green-600 py-3 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-[#006622] focus:ring-offset-1 transition text-white  rounded-md disabled:bg-green-600/50'
                  >
                    {
                      loading ? "chargement... " : "se connecter"
                    }
                  </button>
           </form> 
             
        </div>
       
    </div>
  )
}

export default Login
