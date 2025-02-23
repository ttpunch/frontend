'use client';

import React from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the dashboard as the main page
  redirect('/dashboard');
}