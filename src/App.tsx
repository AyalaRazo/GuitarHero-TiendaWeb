import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProductProvider } from './context/ProductContext';
import RequireAuth from './components/RequireAuth';
import { ScrollToTop } from './components/ScrollToTop';
import { CheckoutLayout } from './layouts/CheckoutLayout';
import { MainLayout } from './layouts/MainLayout';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AccountLayout } from './pages/account/AccountLayout';
import { Addresses } from './pages/account/Addresses';
import { Favorites } from './pages/account/Favorites';
import { Orders } from './pages/account/Orders';
import { Overview } from './pages/account/Overview';
import { Profile } from './pages/account/Profile';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Home } from './pages/Home';
import Login from './pages/Login';
import { NotFound } from './pages/NotFound';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { Products } from './pages/Products';

export function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Products />} />
            <Route path="productos/:categoria" element={<Products />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="pedido-confirmado" element={<OrderConfirmed />} />
            <Route path="login" element={<Login />} />
            <Route path="cuenta/ingresar" element={<Login />} />
            <Route
              path="cuenta"
              element={
                <RequireAuth>
                  <AccountLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Overview />} />
              <Route path="pedidos" element={<Orders />} />
              <Route path="direcciones" element={<Addresses />} />
              <Route path="favoritos" element={<Favorites />} />
              <Route path="datos" element={<Profile />} />
              <Route path="admin" element={<Outlet />}>
                <Route index element={<AdminProducts />} />
                <Route path="productos/nuevo" element={<AdminProductForm />} />
                <Route path="productos/:id" element={<AdminProductForm />} />
              </Route>
            </Route>
            <Route path="admin/products" element={<Navigate to="/cuenta/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<CheckoutLayout />}>
            <Route
              path="checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ProductProvider>
    </AuthProvider>
  );
}