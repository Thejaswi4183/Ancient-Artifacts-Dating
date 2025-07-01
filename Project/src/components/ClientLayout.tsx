'use client';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

