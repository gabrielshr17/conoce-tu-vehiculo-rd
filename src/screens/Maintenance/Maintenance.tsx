import { ComingSoon, TopBar } from '../../ui/components';

export function Maintenance() {
  return (
    <div>
      <TopBar title="Mantenimiento" icon="🛠️" gradient />
      <ComingSoon
        milestone="M3"
        title="Mantenimiento inteligente"
        description="Prioridades por color (Urgente / Pronto / Más adelante) según edad, kilometraje e historial, con contexto dominicano."
      />
    </div>
  );
}
