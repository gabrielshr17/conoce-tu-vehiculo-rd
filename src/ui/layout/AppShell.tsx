import { Car, ClipboardList, LogOut, Wrench } from 'lucide-react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { sessionRepository, vehicleRepository } from '../../storage';
import styles from './AppShell.module.css';

const TABS = [
  { to: '/perfil', label: 'Perfil', icon: Car },
  { to: '/mantenimiento', label: 'Mantenim.', icon: Wrench },
  { to: '/historial', label: 'Historial', icon: ClipboardList },
];

export function AppShell() {
  const navigate = useNavigate();

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
      <div className={styles.content}>
        <Outlet />
      </div>
      <nav className={styles.tabbar}>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>
              <tab.icon size={19} />
            </span>
            {tab.label}
          </NavLink>
        ))}
        <button type="button" className={styles.tab} onClick={handleSignOut}>
          <span className={styles.icon}>
            <LogOut size={19} />
          </span>
          Salir
        </button>
      </nav>
    </div>
  );
}
