import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderGoogleSignInButton } from '../../auth/google';
import { sessionRepository, vehicleRepository } from '../../storage';
import { Button, DrFlag } from '../../ui/components';
import styles from './Welcome.module.css';

export function Welcome() {
  const navigate = useNavigate();
  const vehicle = vehicleRepository.get();
  const session = sessionRepository.get();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session || !googleButtonRef.current) return;
    renderGoogleSignInButton(googleButtonRef.current, (profile) => {
      sessionRepository.save(profile);
      navigate(vehicleRepository.get() ? '/perfil' : '/onboarding');
    });
  }, [session, navigate]);

  return (
    <div className={styles.welcome}>
      <div className={styles.logo}>🚗💨</div>
      <h1 className={styles.title}>
        Conoce tu
        <br />
        Vehículo RD
      </h1>
      <p className={styles.tag}>Cuida tu carro como un experto, sin serlo.</p>
      <div className={styles.rdflag}>
        <DrFlag size={17} /> Hecho para República Dominicana
      </div>
      <div className={styles.spacer} />
      <div className={styles.actions}>
        {!session ? (
          <>
            <p className={styles.tag}>Inicia sesión con Google para empezar.</p>
            <div className={styles.googleButton} ref={googleButtonRef} />
          </>
        ) : vehicle ? (
          <Button variant="inverse" onClick={() => navigate('/perfil')}>
            Continuar con tu {vehicle.make} {vehicle.model} →
          </Button>
        ) : (
          <Button variant="inverse" onClick={() => navigate('/onboarding')}>
            Empezar →
          </Button>
        )}
      </div>
    </div>
  );
}
