import { Navigate, Outlet } from 'react-router-dom';
import { sessionRepository } from '../storage';

export function RequireAuth() {
  const session = sessionRepository.get();
  if (!session) return <Navigate to="/" replace />;
  return <Outlet />;
}
