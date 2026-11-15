/* Clases compartidas. Lo que se repite en varias páginas (botones, hojas de papel,
   campos, chips) se define una sola vez aquí; lo demás va directo en cada componente. */

export const container = 'mx-auto w-full max-w-sitio px-gutter';

/* Títulos */
export const titulo = 'font-display font-normal leading-[1.08] tracking-[-0.01em] text-balance';
export const tituloSeccion = `${titulo} text-2xl`;

/* Botones */
type BtnVariant = 'laton' | 'line' | 'oscuro' | 'lineaOscura';

/* Cada variante define fondo, borde y color completos; el tamaño y el modo "block"
   se eligen con una sola clase de cada tipo para que Tailwind no tenga que desempatar. */
const BTN_BASE =
  'items-center justify-center gap-2 rounded-md border-2 text-center leading-[1.2] font-semibold transition-colors duration-200';

const BTN_VARIANTS: Record<BtnVariant, string> = {
  laton: 'border-laton bg-laton text-palorosa hover:border-laton-claro hover:bg-laton-claro',
  line: 'border-hueso/55 text-hueso hover:border-hueso hover:bg-hueso/10',
  oscuro: 'border-palorosa bg-palorosa text-hueso hover:border-marron hover:bg-marron',
  lineaOscura: 'border-palorosa/50 text-palorosa hover:border-palorosa hover:bg-palorosa/8',
};

export const btn = (variant: BtnVariant, options: { sm?: boolean; block?: boolean } = {}) =>
  [
    BTN_BASE,
    BTN_VARIANTS[variant],
    options.sm ? 'px-4 py-[0.55rem] text-sm' : 'px-6 py-[0.85rem] text-base',
    options.block ? 'flex w-full' : 'inline-flex',
  ].join(' ');

export const btnPeligro = `${BTN_BASE} inline-flex border-sunburst-rojo bg-sunburst-rojo px-6 py-[0.85rem] text-base text-hueso hover:border-rojo-hondo hover:bg-rojo-hondo`;

/* Botón con aspecto de enlace subrayado en latón */
export const linkButton =
  'border-0 bg-transparent p-0 font-semibold underline decoration-laton decoration-2 underline-offset-[0.25em] hover:decoration-current disabled:no-underline disabled:opacity-45';

/* Papel de tienda: hojas, notas y tickets */
export const paper = 'rounded-[3px] bg-papel text-palorosa shadow-papel';
export const paperPad = `${paper} p-[clamp(1.25rem,3vw,2rem)]`;
export const paperTitle = 'font-display text-xl leading-[1.1]';
export const paperMuted = 'text-tinta-suave';

/* Ticket de caja con borde dentado abajo */
export const receipt =
  "relative bg-papel px-6 pt-7 pb-8 text-palorosa drop-shadow-[0_20px_22px_rgba(0,0,0,0.45)] after:absolute after:top-full after:right-0 after:left-0 after:h-[0.6rem] after:bg-[conic-gradient(from_-45deg_at_bottom,transparent,#f8f1dc_1deg_89deg,transparent_90deg)_50%/0.9rem_100%] after:content-['']";
export const receiptRows = 'mt-5 grid gap-[0.7rem]';
export const receiptRow = 'flex justify-between gap-4';
export const receiptTerm = 'text-tinta-suave';
export const receiptValue = 'font-semibold';
export const receiptTotal = 'mt-[1.1rem] flex items-baseline justify-between gap-4 border-t-2 border-palorosa pt-4';
export const receiptTotalLabel = 'font-semibold';
export const receiptTotalValue = 'font-display text-[2rem] leading-none';
export const receiptFree = 'text-pared';

/* Estados de pedido y etiquetas pequeñas */
export type StatusTone = 'taller' | 'enviado' | 'entregado' | 'cancelado';
const STATUS_BASE = 'inline-block rounded-full px-[0.7rem] py-[0.2rem] text-xs leading-[1.4] font-bold';
const STATUS_TONES: Record<StatusTone, string> = {
  taller: 'bg-laton text-palorosa',
  enviado: 'bg-pared text-hueso',
  entregado: 'bg-entregado text-hueso',
  cancelado: 'bg-sunburst-rojo text-hueso',
};
export const status = (tone: StatusTone) => `${STATUS_BASE} ${STATUS_TONES[tone]}`;
export const badgePrincipal =
  'inline-block rounded-full bg-palorosa px-[0.6rem] py-[0.15rem] text-xs font-semibold text-hueso';

/* Formularios */
export const formGrid = 'grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1';
export const field = 'grid content-start gap-[0.35rem]';
export const fieldWide = `${field} col-span-full`;
export const fieldLabel = 'text-sm font-semibold';
export const fieldInput =
  'w-full rounded-md border-2 border-palorosa/30 bg-papel-claro px-[0.85rem] py-[0.7rem] text-palorosa transition-colors duration-200 placeholder:text-placeholder hover:border-palorosa/55 focus-visible:border-pared focus-visible:outline-offset-1';
export const fieldHint = 'text-xs text-tinta-suave';

/* Opciones con borde: envío y forma de pago */
export const radioCard =
  'flex cursor-pointer items-start gap-[0.85rem] rounded-md border-2 border-palorosa/25 p-4 transition-colors duration-200 hover:border-palorosa/55 has-[input:checked]:border-pared has-[input:checked]:bg-pared/8 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-laton-claro [&_input]:mt-[0.15rem] [&_input]:size-[1.15rem] [&_input]:flex-none [&_input]:accent-pared';
export const radioCardTitle = 'block leading-[1.3] font-semibold';
export const radioCardText = 'block text-sm leading-[1.4] text-tinta-suave';
export const radioCardPrice = 'ml-auto font-bold whitespace-nowrap';

/* Casillas */
export const check =
  'flex cursor-pointer items-start gap-[0.6rem] leading-[1.35] [&_input]:mt-[0.15rem] [&_input]:size-[1.1rem] [&_input]:flex-none [&_input]:accent-pared';

/* Chips de filtro: sobre fondo oscuro por defecto, `chipClaro` para fondos claros */
const CHIP_BASE =
  'inline-flex items-center gap-[0.4rem] rounded-full border-[1.5px] bg-transparent px-4 py-[0.45rem] leading-[1.3] font-medium transition-colors duration-200';
export const chip = `${CHIP_BASE} border-hueso/40 text-hueso hover:border-hueso aria-pressed:border-hueso aria-pressed:bg-hueso aria-pressed:text-palorosa aria-[current=page]:border-hueso aria-[current=page]:bg-hueso aria-[current=page]:text-palorosa`;
export const chipClaro = `${CHIP_BASE} border-palorosa/40 text-palorosa hover:border-palorosa aria-pressed:border-palorosa aria-pressed:bg-palorosa aria-pressed:text-hueso`;

/* Tablero perforado, como el de la pared de una tienda de música */
export const pegboard =
  'bg-pared-hondo bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.55)_0_3px,transparent_3.5px)] bg-[size:30px_30px]';

/* Enlace para saltar al contenido: aparece al enfocarlo con el teclado */
export const skipLink =
  'absolute top-[-4rem] left-4 z-[100] rounded-md bg-laton px-4 py-3 font-semibold text-palorosa focus:top-4';
