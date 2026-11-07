import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemListPage from './pages/ItemListPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ItemFormPage from './pages/ItemFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyActivityPage from './pages/MyActivityPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        {/* Top Navbar & Mobile Bottom Dock */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
          <Routes>
            <Route path="/" element={<ItemListPage />} />
            <Route path="/items/new" element={<ItemFormPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/items/:id/edit" element={<ItemFormPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-activity" element={<MyActivityPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 mb-16 sm:mb-0">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs font-semibold text-slate-400">
              LostRadar &bull; Campus Lost and Found
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
