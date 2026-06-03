import React, { useState } from 'react'
import { Link } from 'react-router-dom'



const login = () => {
   const [loading ,setLoading] = useState(false)
   const [form , setForm] = useState({
     email :  "",
     password :  "",
   })


  const compte = [
     {
       email : "admin@gmail.com",
       password : "Passer123",
       role: "admin",
       token : "123"
     },
     {
       email : "etudiant@gmail.com",
       password : "Passer123",
       role: "etudiant",
        token : "123"
     },
     {
       email : "enseignant@gmail.com",
       password : "Passer123",
       role: "enseignant",
        token : "123"
     },
     {
       email : "tuteur@gmail.com",
       password : "Passer123",
       role: "tuteur",
        token : "123"

     },
     {
       email : "insertion@gmail.com",
       password : "Passer123",
       role: "insertion",
        token : "123"
     },
  ]

  const handleLogin = (e) => {

      e.preventDefault();
      setLoading(true)

      const data = {
        email : form.email ,
        password : form.password
      }

      console.log(data)
      setLoading(false)


  } 


  return (
    <div className='w-full h-screen max-sm:px-3 max-h-screen bg-cover bg-center flex items-center justify-center ' style={{backgroundImage: "url('/cas-bg.jpeg')"}}>

        <div className=" w-full max-w-md   bg-white/60 backdrop-blur-lg  rounded-2xl shadow-2xl py-8 px-8 border border-[#cb6f29] border-l-8">
          
           <div className="login_top text-center mt-2 mb-5">
               <h1 className='text-xl font-bold  '>Connexion</h1>
               <p className='text-xs text-neutral mt-1'>Bienvenue ! Connectez-vous à votre compte</p>
           </div>

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
                      onchange = {e => setForm({...form , password:e.target.value})}
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
                    className='mt-5 text-center text-xs w-full bg-green-600 py-3 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-[#006622] focus:ring-offset-1 transition text-white  rounded-md'
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

export default login
