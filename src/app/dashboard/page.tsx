'use client';

import React, { useState, useEffect } from 'react';
import { DataCard } from '@/components/DataCard';
import { api } from '@/services/api';
import websocketService from '@/services/websocket';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const response = await api.get('/data');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();

    // Set up WebSocket connection and handle real-time updates
    websocketService.connect();
    
    websocketService.onMessage((update) => {
      if (update.event === 'update') {
        setData((prevData) => ({ ...prevData, ...update.data }));
      }
    });

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time OPCUA Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(data).map(([key, value]) => (
              <DataCard key={key} name={key} value={value} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}