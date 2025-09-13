import {useEffect, useState} from 'react'
import Router from 'next/router'
export default function Dashboard(){
const [user,setUser]=useState(null)
useEffect(()=>{
const token = localStorage.getItem('token')
if(!token) { Router.push('/login'); return }
fetch('http://localhost:5000/api/me',{headers:{Authorization:`Bearer ${token}`}})
.then(r=>r.json())
.then(j=>{ if(j.error) Router.push('/login'); else setUser(j) })
},[])
if(!user) return <p>cargando...</p>
return (
<main style={{fontFamily:'Arial',padding:20}}>
<h2>Dashboard</h2>
<p>Email: {user.email}</p>
<p>Rol: {user.role}</p>
<button onClick={()=>{localStorage.removeItem('token'); Router.push('/')}}>Salir</button>
</main>
)
}