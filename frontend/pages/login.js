import {useState} from 'react'
import Router from 'next/router'
export default function Login(){
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const [err,setErr]=useState('')
async function submit(e){
e.preventDefault()
const res = await fetch('http://localhost:5000/api/login',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({email,password})
})
const data = await res.json()
if(res.ok){
// guardamos token simple en localStorage
localStorage.setItem('token', data.token)
Router.push('/dashboard')
} else setErr(data.error || 'error')
}
return (
<main style={{fontFamily:'Arial',padding:20}}>
<h2>Login</h2>
<form onSubmit={submit}>
<label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} required/></label><br/>
<label>Contraseña<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><br/>
<button type="submit">Entrar</button>
</form>
<p style={{color:'red'}}>{err}</p>
</main>
)
}