'use client';

import React, { useState } from 'react';
import { ConfigForm } from '@/components/ConfigForm';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface VariableConfig {
  name: string;
  value: any;
}

interface Config {
  namespace: string;
  variables: VariableConfig[];
}

export default function Settings() {
  const [message, setMessage] = useState<string>('');

  const handleConfigSubmit = async (config: Config) => {
    try {
      const response = await api.post('/config', config);
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Configure Namespace and Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigForm onSubmit={handleConfigSubmit} />
          {message && <p className="text-blue-500 mt-4">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}