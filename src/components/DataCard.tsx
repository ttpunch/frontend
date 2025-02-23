'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DataCardProps {
  name: string;
  value: any;
}

export function DataCard({ name, value }: DataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{JSON.stringify(value)}</p>
      </CardContent>
    </Card>
  );
}