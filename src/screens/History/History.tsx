import { ComingSoon, TopBar } from '../../ui/components';

export function History() {
  return (
    <div>
      <TopBar title="Historial" icon="📋" gradient />
      <ComingSoon
        milestone="M4"
        title="La hoja de vida de tu carro"
        description="Línea de tiempo de reparaciones y gastos. Registrar algo aquí actualiza las recomendaciones de mantenimiento."
      />
    </div>
  );
}
