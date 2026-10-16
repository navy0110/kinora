import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Kinora — Communities without borders', description: 'An open agenda of gatherings and opportunities on Arkiv.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
