import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { History } from './screens/History/History';
import { Maintenance } from './screens/Maintenance/Maintenance';
import { Onboarding } from './screens/Onboarding/Onboarding';
import { Profile } from './screens/Profile/Profile';
import { Welcome } from './screens/Welcome/Welcome';
import { AppShell } from './ui/layout/AppShell';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppShell />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mantenimiento" element={<Maintenance />} />
          <Route path="/historial" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
