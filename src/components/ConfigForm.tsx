'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface VariableConfig {
  name: string;
  value: any;
}

interface ConfigFormProps {
  onSubmit: (config: { namespace: string; variables: VariableConfig[] }) => void;
  buttonText?: string;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ onSubmit, buttonText = "Submit" }) => {
  const [namespace, setNamespace] = useState<string>('http://example.com/opcua/server');
  const [variables, setVariables] = useState<VariableConfig[]>([{ name: '', value: '' }]);

  const handleVariableChange = (index: number, field: keyof VariableConfig, value: string) => {
    const newVariables = [...variables];
    newVariables[index][field] = value;
    setVariables(newVariables);
  };

  const addVariable = () => {
    setVariables([...variables, { name: '', value: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      namespace,
      variables,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Namespace URI:</label>
        <Input
          type="text"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          placeholder="e.g., http://example.com/opcua/server"
        />
      </div>
      {variables.map((variable, index) => (
        <div key={index} className="flex gap-2">
          <Input
            type="text"
            value={variable.name}
            onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
            placeholder="Variable Name"
          />
          <Input
            type="text"
            value={variable.value}
            onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
            placeholder="Initial Value"
          />
          {index === variables.length - 1 && (
            <Button type="button" onClick={addVariable} variant="outline">
              Add Variable
            </Button>
          )}
        </div>
      ))}
      <Button type="submit">{buttonText}</Button>
    </form>
  );
}