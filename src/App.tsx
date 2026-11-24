import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import { ScrollToTop } from './components/ScrollToTop';
import { MainLayout } from './layouts/MainLayout';

// Páginas de autenticación y administración
import Login from './pages/Login';
import Register from './pages/Register';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminProducts } from './pages/admin/AdminProducts';

// Cuenta
import { AccountLayout } from './pages/account/AccountLayout';
import { Addresses } from './pages/account/Addresses';
import { Favorites } from './pages/account/Favorites';
import { Orders } from './pages/account/Orders';
import { Overview } from './pages/account/Overview';
import { Profile } from './pages/account/Profile';

// Tienda
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { OrderConfirmed } from './pages/OrderConfirmed';
import { ProductDetail } from './pages/ProductDetail';
import { Products } from './pages/Products';

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:categoria" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/pedido-confirmado" element={<OrderConfirmed />} />

          {/* Ruta de Login y registro */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Panel de la cuenta: al iniciar sesión se llega aquí. Los administradores ven además el CRUD */}
          <Route
            path="/cuenta"
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
            <Route
              path="admin"
              element={
                <RequireAuth role="admin">
                  <Outlet />
                </RequireAuth>
              }
            >
              <Route index element={<AdminProducts />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="productos/nuevo" element={<AdminProductForm />} />
              <Route path="productos/:id" element={<AdminProductForm />} />
            </Route>
          </Route>

          {/* Ruta anterior del panel: ahora vive dentro de la cuenta */}
          <Route path="/admin/products" element={<Navigate to="/cuenta/admin" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
