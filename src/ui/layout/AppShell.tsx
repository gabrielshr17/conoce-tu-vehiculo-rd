import { Car, History, LogOut, ShieldCheck, Wrench } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { sessionRepository, vehicleRepository } from '../../storage';
import styles from './AppShell.module.css';
import { useDocumentTitle } from './useDocumentTitle';
import type { ShellContext } from './useShell';

const TABS = [
  { to: '/perfil', label: 'Vehículo', icon: Car },
  { to: '/mantenimiento', label: 'Servicios', icon: Wrench },
  { to: '/historial', label: 'Historial', icon: History },
  { to: '/consejos', label: 'Consejos', icon: ShieldCheck },
];

export function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useDocumentTitle(TABS.find((tab) => tab.to === pathname)?.label);

  // Sin vehículo identificado no hay nada que mostrar en estas pantallas.
  if (!vehicleRepository.get()) {
    return <Navigate to="/" replace />;
  }

  function handleSignOut() {
    sessionRepository.clear();
    navigate('/');
  }

  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        <Outlet context={{ onSignOut: handleSignOut } satisfies ShellContext} />
      </main>
      <nav className={styles.tabbar} aria-label="Principal">
        <div className={styles.brand}>
          <span className={styles.crest}>RD</span>
          Conoce tu vehículo
        </div>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>
              <tab.icon size={20} />
            </span>
            {tab.label}
          </NavLink>
        ))}
        <button type="button" className={`${styles.tab} ${styles.signOut}`} onClick={handleSignOut}>
          <span className={styles.icon}>
            <LogOut size={20} />
          </span>
          Salir
        </button>
      </nav>
    </div>
  );
}
