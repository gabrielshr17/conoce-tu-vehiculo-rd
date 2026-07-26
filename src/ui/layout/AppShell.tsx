import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { vehicleRepository } from '../../storage';
import styles from './AppShell.module.css';

const TABS = [
  { to: '/perfil', label: 'Perfil', icon: '🚙' },
  { to: '/mantenimiento', label: 'Mantenim.', icon: '🛠️' },
  { to: '/historial', label: 'Historial', icon: '📋' },
];

export function AppShell() {
  // Sin vehículo identificado no hay nada que mostrar en estas pantallas.
  if (!vehicleRepository.get()) {
    return <Navigate to="/" replace />;
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
            <span className={styles.icon}>{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
