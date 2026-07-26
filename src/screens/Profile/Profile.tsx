import { ComingSoon, TopBar } from '../../ui/components';

export function Profile() {
  return (
    <div>
      <TopBar title="Perfil del vehículo" icon="🚙" />
      <ComingSoon
        milestone="M2"
        title="Conoce tu carro"
        description="Descripción en lenguaje simple, cómo tratarlo, mejor rendimiento, accesorios recomendados y comunidades."
      />
    </div>
  );
}
