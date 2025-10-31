import Home from '@/components/Home';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <Home />
        </div>
      </main>
    </div>
  );
}