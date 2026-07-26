import { vehicleRepository } from '../../storage';
import { ComingSoon, TopBar } from '../../ui/components';

export function Profile() {
  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  const vehicle = vehicleRepository.get();
  if (!vehicle) return null;

  const fuelLabel = vehicle.fuelType === 'diesel' ? 'Diésel' : 'Gasolina';

  return (
    <div>
      <TopBar
        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        subtitle={`${vehicle.trim} · ${fuelLabel}`}
        icon="🚙"
        gradient
      />
      <ComingSoon
        milestone="M2"
        title="Conoce tu carro"
        description="Descripción en lenguaje simple, cómo tratarlo, mejor rendimiento, accesorios recomendados y comunidades."
      />
    </div>
  );
}
