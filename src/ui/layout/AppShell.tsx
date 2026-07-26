import { NavLink, Outlet } from 'react-router-dom';
import styles from './AppShell.module.css';

const TABS = [
  { to: '/perfil', label: 'Perfil', icon: '🚙' },
  { to: '/mantenimiento', label: 'Mantenim.', icon: '🛠️' },
  { to: '/historial', label: 'Historial', icon: '📋' },
];

export function AppShell() {
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
