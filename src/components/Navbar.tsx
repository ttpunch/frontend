'use client';

import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-center gap-4">
        <Button asChild variant="ghost" className="text-white hover:text-gray-300">
          <Link href="/">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost" className="text-white hover:text-gray-300">
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
    </nav>
  );
}