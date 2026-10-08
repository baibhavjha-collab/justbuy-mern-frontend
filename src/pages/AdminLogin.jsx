import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin(){
  const [form,setForm]=useState({email:'',password:''});
  const [busy,setBusy]=useState(false);
  const {adminLogin}=useAuth();
  const nav=useNavigate();
  const submit=async e=>{e.preventDefault();setBusy(true);try{await adminLogin(form);nav('/admin');}catch(err){}finally{setBusy(false);}};
  return <section className="auth-section"><div className="auth-card">
    <span className="eyebrow">JUSTBUY ADMIN</span><h1>Administrator sign in</h1><p>Access your store management dashboard.</p>
    <form onSubmit={submit}>
      <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label>Password<input required minLength={6} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
      <button className="btn full" disabled={busy}>{busy?'Please wait...':'Sign in as administrator'}</button>
    </form>
    <p><Link to="/login">Customer sign in</Link></p>
  </div></section>;
}
