import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Todo = { id: string; title: string; body?: string; done: boolean }

export default function Todos(){
  const [items, setItems] = useState<Todo[]>([])
  useEffect(()=>{ axios.get('/api/todos', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }).then(r => setItems(r.data)).catch(()=>{}) }, [])

  return (
    <div className="max-w-2xl mx-auto">
