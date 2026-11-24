import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toggleFavorite, useFavoriteIds } from '../store/favorites';
import { HeartIcon } from './Icons';

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

/* Corazón para guardar un producto. Sin sesión, lleva al login y regresa aquí. */
export function FavoriteButton({ productId, productName, className = '' }: FavoriteButtonProps) {
  const { account: user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const favorites = useFavoriteIds(user?.id);
  const active = favorites.includes(productId);

  const handleClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search, reason: 'favoritos' } });
      return;
    }
    toggleFavorite(user.id, productId);
  };

  return (
    <button
      className={`grid size-9 place-items-center rounded-full border-2 transition-colors duration-200 ${
        active
          ? 'border-sunburst-rojo bg-sunburst-rojo text-hueso'
          : 'border-palorosa/40 bg-hueso text-palorosa hover:border-palorosa'
      } ${className}`}
      type="button"
      aria-pressed={active}
      aria-label={active ? `Quitar ${productName} de favoritos` : `Guardar ${productName} en favoritos`}
      onClick={handleClick}
    >
      <HeartIcon className="size-5" filled={active} />
    </button>
  );
}
