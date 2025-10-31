import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function AdminPanel({profile, user}){
  const [pendingDeps, setPendingDeps] = useState([])
  const [pendingWds, setPendingWds] = useState([])
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadAll()
  },[])

  async function loadAll(){
    const { data: deps } = await supabase.from('transactions').select('*, profiles(display_name)').eq('type','deposit').eq('status','pending').order('created_at',{ascending:false})
    const { data: wds } = await supabase.from('transactions').select('*, profiles(display_name)').eq('type','withdrawal').eq('status','pending').order('created_at',{ascending:false})
    const { data: t } = await supabase.from('tasks').select('*').order('created_at',{ascending:false})
    const { data: u } = await supabase.from('profiles').select('*').order('created_at',{ascending:false}).limit(200)
    setPendingDeps(deps || []); setPendingWds(wds || []); setTasks(t || []); setUsers(u || [])
  }

  async function approveDeposit(tx){
    const { error } = await supabase.from('transactions').update({ status:'completed' }).eq('id', tx.id)
    if (error) return alert(error.message)
    alert('Deposit approved.')
    loadAll()
  }

  async function rejectDeposit(tx){
    const { error } = await supabase.from('transactions').update({ status:'rejected' }).eq('id', tx.id)
    if (error) return alert(error.message)
    alert('Deposit rejected.')
    loadAll()
  }

  async function approveWithdraw(tx){
    const { error } = await supabase.from('transactions').update({ status:'completed' }).eq('id', tx.id)
    if (error) return alert(error.message)
    alert('Withdrawal approved.')
    loadAll()
  }

  async function rejectWithdraw(tx){
    const { error } = await supabase.from('transactions').update({ status:'rejected' }).eq('id', tx.id)
    if (error) return alert(error.message)
    loadAll()
  }

  async function createTask(){
    const title = prompt('Task title'); if(!title) return
    const desc = prompt('Task description'); const reward = prompt('Reward amount (e.g., 1.00)'); const r = parseFloat(reward)
    if (isNaN(r) || r<=0) return alert('Invalid reward')
    const { error } = await supabase.from('tasks').insert([{ title, description: desc, reward: r }])
    if (error) return alert(error.message)
    alert('Task created'); loadAll()
  }

  return (
    <div className="container">
      <header className="header"><h1>KingProfit — Admin</h1><div className="user">{profile.display_name || user.email}</div></header>
      <div style={{marginBottom:12}}><button className="btn" onClick={createTask}>Create Task</button></div>

      <h3>Pending Deposits</h3>
      <table className="tx"><thead><tr><th>User</th><th>Amount</th><th>Proof</th><th>Actions</th></tr></thead>
        <tbody>
          {pendingDeps.map(p => (
            <tr key={p.id}>
              <td>{p.profiles?.display_name || p.user_id}</td>
              <td>{Number(p.amount).toFixed(2)}</td>
              <td>{p.screenshot_url ? <a target="_blank" href={supabase.storage.from('deposit-proofs').getPublicUrl(p.screenshot_url).publicURL}>View</a> : '—'}</td>
              <td>
                <button className="btn" onClick={()=>approveDeposit(p)}>Approve</button>
                <button className="btn" style={{background:'#ef4444'}} onClick={()=>rejectDeposit(p)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:18}}>Pending Withdrawals</h3>
      <table className="tx"><thead><tr><th>User</th><th>Amount</th><th>Details</th><th>Actions</th></tr></thead>
        <tbody>
          {pendingWds.map(w => (
            <tr key={w.id}>
              <td>{w.profiles?.display_name || w.user_id}</td>
              <td>{Number(w.amount).toFixed(2)}</td>
              <td>{w.meta?.phone || '—'}</td>
              <td>
                <button className="btn" onClick={()=>approveWithdraw(w)}>Approve</button>
                <button className="btn" style={{background:'#ef4444'}} onClick={()=>rejectWithdraw(w)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:18}}>Tasks</h3>
      <table className="tx"><thead><tr><th>Title</th><th>Reward</th><th>Active</th></tr></thead>
        <tbody>{tasks.map(t => (<tr key={t.id}><td>{t.title}</td><td>{Number(t.reward).toFixed(2)}</td><td>{t.active ? 'Yes' : 'No'}</td></tr>))}</tbody>
      </table>

      <h3 style={{marginTop:18}}>Users</h3>
      <table className="tx"><thead><tr><th>Name/Email</th><th>Admin</th><th>Created</th></tr></thead>
        <tbody>{users.map(u => (<tr key={u.id}><td>{u.display_name || u.id}</td><td>{u.is_admin ? 'Yes' : 'No'}</td><td>{new Date(u.created_at).toLocaleString()}</td></tr>))}</tbody>
      </table>
    </div>
  )
}
