# Guitar Hero

Tienda en línea de instrumentos musicales. Esta primera etapa es solo diseño: React + TypeScript + Vite, sin lógica de negocio.

## Cómo correrlo

```bash
npm install
npm run dev
```

`npm run build` compila TypeScript y genera la carpeta `dist`.

## Dirección de diseño

La paleta sale de una tienda de música de barrio. Los colores, tipografías y breakpoints viven en el bloque `@theme` de `src/index.css` (Tailwind v4).

| Token | Valor | De dónde viene |
| --- | --- | --- |
| `--pared` | `#1F3D33` | Pared pintada de verde |
| `--pared-hondo` | `#172F27` | Tablero perforado donde cuelgan las cosas |
| `--palorosa` | `#2B1810` | Diapasón de palorosa |
| `--palorosa-claro` | `#3B2217` | Banco de trabajo |
| `--tweed` | `#E2CE9C` | Cartulina de las etiquetas y forro tweed |
| `--hueso` | `#F3EBD3` | Cejuela de hueso |
| `--laton` | `#C99A3A` | Herrajes y clavijas |
| `--sunburst-rojo` | `#A3301F` | Rojo del sunburst |

Tipografías: Caprasimo (títulos y precios) e Instrument Sans (texto), instaladas con Fontsource.

## Páginas y rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Portada. "Colgado en la pared" muestra solo los productos con `featured: true` |
| `/productos` | Todo el catálogo. Acepta `?q=` para buscar |
| `/productos/:categoria` | Un pasillo: guitarras, bajos, amplificadores, teclados, bateria, accesorios |
| `/carrito` | Carrito. Agrega `?vacio` para ver el carrito vacío |
| `/checkout` | Pago en una página, con tres pasos (layout aparte, sin menú) |
| `/pedido-confirmado` | Pedido recibido |
| `/cuenta/ingresar` | Inicio de sesión y registro. Mi cuenta y el checkout llevan aquí si no hay sesión |
| `/cuenta` | Resumen de la cuenta |
| `/cuenta/pedidos` | Mis pedidos, con filtros por estado y detalle desplegable |
| `/cuenta/direcciones` | Direcciones guardadas |
| `/cuenta/favoritos` | Favoritos |
| `/cuenta/datos` | Datos personales, contraseña y avisos |
| `/cuenta/admin` | Panel administrativo: lista de productos (solo rol admin) |
| `/cuenta/admin/productos/nuevo` | Formulario de producto nuevo, con vista previa |
| `/cuenta/admin/productos/:id` | Editar un producto |

Para revisar el diseño, la sesión es provisional (`auth/AuthContext.tsx`, en memoria, se pierde al recargar): entra con cualquier correo; si empieza con «admin» tendrás el rol administrador y verás «Panel administrativo» en el menú de la cuenta.

El buscador del encabezado siempre lleva a `/productos?q=...` (categoría Todo).

## Estructura

```
src/
  components/   Piezas reutilizables, con sus estilos en Tailwind dentro del .tsx
  layouts/      MainLayout (con menú y pie) y CheckoutLayout (sin distracciones)
  auth/         AuthContext (sesión provisional) 
  pages/        Una por ruta; pages/account/ tiene las de la cuenta y pages/admin/ el CRUD
  data/         catalog.ts (productos, categorías), facets.ts (filtros por pasillo)
                y sample.ts (carrito, pedidos y direcciones de muestra)
  ui.ts         Clases de Tailwind compartidas: botones, hojas de papel, campos, chips, tickets
  index.css     Tailwind, tokens de la paleta (@theme) y estilos base
```

## Qué funciona ya y qué es solo diseño

Funciona: navegación entre páginas, categorías por URL, búsqueda, ordenar por precio, estado vacío de búsqueda y carrito, selección de envío y forma de pago en el checkout (el total cambia con el envío), filtro por estado en Mis pedidos.

Solo visual por ahora: los filtros de la barra lateral (casillas y precio), cantidades y "Quitar" del carrito, "Agregar", formularios, favoritos, cupón y guardar/eliminar en el panel administrativo. Todos los datos salen de `data/`.

## Pendiente para las siguientes etapas

- Datos reales y persistencia.
- Lógica de carrito, filtros, validaciones y autenticación.
- Página de detalle de producto (hoy los nombres de producto no abren nada).
- Fotos de producto en lugar de las ilustraciones de `ProductArt.tsx`.
