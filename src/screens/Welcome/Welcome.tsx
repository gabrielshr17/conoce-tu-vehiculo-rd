import { useNavigate } from 'react-router-dom';
import { vehicleRepository } from '../../storage';
import { Button } from '../../ui/components';
import styles from './Welcome.module.css';

export function Welcome() {
  const navigate = useNavigate();
  const vehicle = vehicleRepository.get();

  return (
    <div className={styles.welcome}>
      <div className={styles.logo}>🚗💨</div>
      <h1 className={styles.title}>
        Conoce tu
        <br />
        Vehículo RD
      </h1>
      <p className={styles.tag}>Cuida tu carro como un experto, sin serlo.</p>
      <div className={styles.rdflag}>🇩🇴 Hecho para República Dominicana</div>
      <div className={styles.spacer} />
      <div className={styles.actions}>
        <Button variant="inverse" onClick={() => navigate('/onboarding')}>
          Empezar →
        </Button>
        {vehicle ? (
          <button type="button" className={styles.link} onClick={() => navigate('/perfil')}>
            Continuar con tu {vehicle.make} {vehicle.model} →
          </button>
        ) : (
          <button type="button" className={styles.link}>
            Ya tengo cuenta
          </button>
        )}
      </div>
    </div>
  );
}
