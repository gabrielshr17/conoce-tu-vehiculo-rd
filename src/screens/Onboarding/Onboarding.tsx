import { useNavigate } from 'react-router-dom';
import { ComingSoon, Stepper, TopBar } from '../../ui/components';

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <div>
      <TopBar title="Identifica tu vehículo" subtitle="Paso 1 de 4" onBack={() => navigate('/')} />
      <div style={{ padding: '18px' }}>
        <Stepper total={4} current={1} />
      </div>
      <ComingSoon
        milestone="M1"
        title="Selecciona tu vehículo"
        description="Año → Marca → Modelo → Versión, eligiendo siempre de una lista — nunca escribiendo a mano."
      />
    </div>
  );
}
