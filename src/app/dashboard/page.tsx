'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function Dashboard() {
  const [variables, setVariables] = useState<Array<{name: string, value: any}>>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchVariables = async () => {
    try {
      const response = await api.get('/config');
      if (response.data?.config) {
        const vars = Object.entries(response.data.config).map(([name, value]) => ({
          name,
          value
        }));
        setVariables(vars);
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching variables:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchVariables();
    
    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchVariables, 2000);
    
    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OPC UA Variables Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variables.map((variable, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">{variable.name}</h2>
            <p className="text-2xl font-bold text-blue-600">{String(variable.value)}</p>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}