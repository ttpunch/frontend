'use client';

import React, { useState, useEffect } from 'react';
import { ConfigForm } from '@/components/ConfigForm';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface VariableConfig {
  name: string;
  value: number | string | boolean;  // Specify allowed types
}

interface Config {
  namespace: string;
  variables: VariableConfig[];
}

export default function Settings() {
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [variables, setVariables] = useState<Array<{name: string, value: any}>>([]);

  // Add useEffect to fetch variables on component mount
  useEffect(() => {
    // Initial fetch
    fetchVariables();
    
    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchVariables, 2000);
    
    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
    } catch (error) {
      handleError(error);
    }
  };

  const handleVariableCreate = async (config: Config) => {
    try {
      setIsError(false);
      setMessage('Creating variable...');
      
      const variable = config.variables[0]?.name || '';
      const value = config.variables[0]?.value || '';
      const namespace = config.namespace || '';
      
      const response = await api.post(
        `/config?namespace_uri=${encodeURIComponent(namespace)}&variable_name=${encodeURIComponent(variable)}&variable_value=${encodeURIComponent(value)}`,
        {
          namespace_uri: namespace,
          variables: {
            [variable]: value
          }
        }
      );
      
      setIsError(false);
      setMessage('Variable created successfully');
      // Fetch updated variables after creation
      await fetchVariables();
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleVariableUpdate = async (config: Config) => {
    try {
      setIsError(false);
      setMessage('Updating variable...');
      
      const variable = config.variables[0]?.name || '';
      const value = config.variables[0]?.value || '';
      
      const response = await api.post(`/data?variable=${encodeURIComponent(variable)}&value=${encodeURIComponent(value)}`);
      
      setIsError(false);
      setMessage(response.data.message || 'Variable updated successfully');
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    setIsError(true);
    let errorMessage = 'Failed to process request';
    
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        errorMessage = detail.map(err => err.msg || 'Unknown error').join(', ');
      } else if (typeof detail === 'object' && detail !== null) {
        errorMessage = detail.msg || detail.message || JSON.stringify(detail);
      } else {
        errorMessage = String(detail);
      }
    }
    
    setMessage(errorMessage);
    console.error('Operation error:', error);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Variable</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigForm onSubmit={handleVariableCreate} buttonText="Create Variable" />
        </CardContent>
      </Card>

      {/* Add Variables List */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {variables.map((variable, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{variable.name}</span>
                <span>{String(variable.value)}</span>
              </div>
            ))}
            {variables.length === 0 && (
              <p className="text-gray-500">No variables created yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Update Variable card remains the same */}
      <Card>
        <CardHeader>
          <CardTitle>Update Variable Value</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigForm onSubmit={handleVariableUpdate} buttonText="Update Value" />
          {message && (
            <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}