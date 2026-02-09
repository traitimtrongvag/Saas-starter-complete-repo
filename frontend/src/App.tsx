import React from 'react';
import Todos from './pages/Todos';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold">SaaS Starter</h1>
      </header>
      <main className="p-6">
        <Todos />
      </main>
    </div>
  );
}
