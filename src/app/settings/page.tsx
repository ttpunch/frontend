'use client';

import React, { useState } from 'react';
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

  const handleVariableCreate = async (config: Config) => {
    try {
      setIsError(false);
      setMessage('Creating variable...');
      
      const variable = config.variables[0]?.name || '';
      const value = config.variables[0]?.value || '';
      const validatedValue = value;
      
      await api.post('/config/variable', {
        name: variable,
        value: validatedValue
      });
      
      setIsError(false);
      setMessage('Variable created successfully');
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