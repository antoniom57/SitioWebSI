import {useState} from 'react'
import Router from 'next/router'
export default function Register(){
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const [role,setRole]=useState('user')
const [err,setErr]=useState('')
async function submit(e){
e.preventDefault()
const res = await fetch('http://localhost:5000/api/register',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({email,password,role})
})
const data = await res.json()
if(res.ok) Router.push('/login')
else setErr(data.error || 'error')
}
return (
<main style={{fontFamily:'Arial',padding:20}}>
<h2>Registro</h2>
<form onSubmit={submit}>
<label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} required/></label><br/>
<label>Contraseña<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><br/>
<label>Rol<br/>
<select value={role} onChange={e=>setRole(e.target.value)}>
<option value="user">user</option>
<option value="admin">admin</option>
</select>
</label><br/>
<button type="submit">Registrar</button>
</form>
<p style={{color:'red'}}>{err}</p>
</main>
)
}