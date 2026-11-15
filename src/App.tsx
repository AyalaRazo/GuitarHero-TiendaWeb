import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './components/RequireAuth';

// Páginas de Autenticación y Admin
import Login from './pages/Login';
import { AdminProducts } from './pages/admin/AdminProducts';

import { Home } from './pages/Home'; 
import {Products} from './pages/Products'; 
import {Cart} from './pages/Cart';
import {Checkout} from './pages/Checkout';
import {NotFound} from './pages/NotFound';
import {MainLayout} from './layouts/MainLayout'; 

export function App() { 
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:categoria" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Ruta de Login */}
          <Route path="/login" element={<Login />} />
        </Route>

        <Route 
          path="/admin/products" 
          element={
            <RequireAuth>
              <AdminProducts />
            </RequireAuth>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}