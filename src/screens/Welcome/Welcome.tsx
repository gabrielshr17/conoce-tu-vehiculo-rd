import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../auth/google';
import { sendWelcomeEmail } from '../../auth/welcomeEmail';
import { sessionRepository, vehicleRepository } from '../../storage';
import { Button, DrFlag, GoogleIcon } from '../../ui/components';
import styles from './Welcome.module.css';

const GOOGLE_PASSWORD_RECOVERY_URL = 'https://accounts.google.com/signin/recovery';

export function Welcome() {
  const navigate = useNavigate();
  const vehicle = vehicleRepository.get();
  const session = sessionRepository.get();

  function handleGoogleSignIn() {
    signInWithGoogle((profile, accessToken) => {
      sessionRepository.save(profile);
      sendWelcomeEmail(accessToken);
      navigate(vehicleRepository.get() ? '/perfil' : '/onboarding');
    });
  }

  return (
    <div className={styles.welcome}>
      <div className={styles.logo}>
        <Car size={56} strokeWidth={1.75} />
      </div>
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
            <Button variant="inverse" className={styles.googleButton} onClick={handleGoogleSignIn}>
              <GoogleIcon size={18} className={styles.googleIcon} /> Iniciar sesión con Google
            </Button>
            <a
              className={styles.link}
              href={GOOGLE_PASSWORD_RECOVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ¿Olvidaste tu contraseña?
            </a>
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
