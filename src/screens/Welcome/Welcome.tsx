import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../auth/google';
import { sendWelcomeEmail } from '../../auth/welcomeEmail';
import { sessionRepository, vehicleRepository } from '../../storage';
import { Button, CarSilhouette, DrFlag, GoogleIcon } from '../../ui/components';
import { useDocumentTitle } from '../../ui/layout/useDocumentTitle';
import styles from './Welcome.module.css';

const GOOGLE_ACCOUNT_RECOVERY_URL = 'https://accounts.google.com/signin/recovery';

export function Welcome() {
  const navigate = useNavigate();
  useDocumentTitle();
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
    <main className={styles.welcome}>
      <div className={styles.brand}>
        <span className={styles.crest}>RD</span>
        Conoce tu vehículo
      </div>

      <div className={styles.stage}>
        <CarSilhouette size="hero" />
      </div>

      <div className={styles.copy}>
        <h1 className={styles.title}>Cuida tu carro como un experto, sin serlo.</h1>
        <p className={styles.tag}>
          Qué le toca, cuándo y cuánto cuesta, en palabras simples. Sin jerga de taller.
        </p>
        <div className={styles.rdflag}>
          <DrFlag size={16} /> Hecho para República Dominicana
        </div>
      </div>

      <div className={styles.actions}>
        {!session ? (
          <>
            <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
              <GoogleIcon size={18} /> Continuar con Google
            </button>
            <a
              className={styles.link}
              href={GOOGLE_ACCOUNT_RECOVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              ¿No puedes entrar a tu cuenta de Google?
            </a>
          </>
        ) : vehicle ? (
          <Button onClick={() => navigate('/perfil')}>
            Continuar con tu {vehicle.make} {vehicle.model}
          </Button>
        ) : (
          <Button onClick={() => navigate('/onboarding')}>Identificar mi carro</Button>
        )}
      </div>
    </main>
  );
}
