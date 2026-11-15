import { Beneficios } from '../components/Beneficios';
import { Destacados } from '../components/Destacados';
import { Hero } from '../components/Hero';
import { Newsletter } from '../components/Newsletter';
import { Pasillos } from '../components/Pasillos';
import { Taller } from '../components/Taller';

export function Home() {
  return (
    <>
      <Hero />
      <Beneficios />
      <Pasillos />
      <Destacados />
      <Taller />
      <Newsletter />
    </>
  );
}
