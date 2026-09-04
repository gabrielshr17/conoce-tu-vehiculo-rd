import { Circle, FileText, Wrench } from 'lucide-react';
import { useState } from 'react';
import { formatKm } from '../../core/format';
import { recommend } from '../../core/maintenance/engine';
import { getSeasonalTip } from '../../core/maintenance/rdModifiers';
import type { HistoryEntry, Priority, Recommendation, Vehicle } from '../../core/types';
import { historyRepository, vehicleRepository } from '../../storage';
import { Button, DrFlag, PriorityCard, TopBar } from '../../ui/components';
import styles from './Maintenance.module.css';

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  urgent: { label: 'URGENTE', color: 'var(--rojo)' },
  soon: { label: 'PRONTO', color: 'var(--amarillo)' },
  later: { label: 'MÁS ADELANTE', color: 'var(--verde)' },
};

const PRIORITY_ORDER: Priority[] = ['urgent', 'soon', 'later'];

export function Maintenance() {
  const maybeVehicle = vehicleRepository.get();
  const [currentKm, setCurrentKm] = useState(maybeVehicle?.currentKm);
  const [kmInput, setKmInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    maybeVehicle ? historyRepository.getAll(maybeVehicle.id) : [],
  );

  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!maybeVehicle) return null;
  const vehicle: Vehicle = maybeVehicle;

  function saveOdometer() {
    const km = Number(kmInput);
    if (!Number.isFinite(km) || km <= 0) return;
    vehicleRepository.save({ ...vehicle, currentKm: km });
    setCurrentKm(km);
  }

  if (currentKm === undefined) {
    return (
      <div>
        <TopBar title="Mantenimiento" icon={<Wrench size={20} />} gradient />
        <div className={styles.body}>
          <p className={styles.ask}>¿Cuántos kilómetros tiene tu carro ahora?</p>
          <p className={styles.muted}>Lo necesitamos para saber qué le toca y para cuándo.</p>
          <input
            className={styles.kmInput}
            type="number"
            inputMode="numeric"
            placeholder="Ej. 98500"
            value={kmInput}
            onChange={(e) => setKmInput(e.target.value)}
          />
          <Button onClick={saveOdometer} disabled={!kmInput}>
            Ver mi mantenimiento →
          </Button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const recommendations = recommend({ vehicleYear: vehicle.year, currentKm, history, today });
  const seasonalTip = getSeasonalTip(today);

  function markDone(rec: Recommendation) {
    if (currentKm === undefined) return;
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      itemId: rec.item.id,
      description: rec.item.name,
      date: today.toISOString().slice(0, 10),
      km: currentKm,
    };
    historyRepository.add(entry);
    setHistory((prev) => [...prev, entry]);
  }

  const groups = PRIORITY_ORDER.map((priority) => ({
    priority,
    items: recommendations.filter((r) => r.priority === priority),
  })).filter((g) => g.items.length > 0);

  const missingHistoryCount = recommendations.filter((r) => !r.hasHistory).length;

  return (
    <div>
      <TopBar
        title="Mantenimiento"
        subtitle={`${vehicle.make} ${vehicle.model} ${vehicle.year} · ${formatKm(currentKm)}`}
        icon={<Wrench size={20} />}
        gradient
      />
      <div className={styles.body}>
        {missingHistoryCount > 0 && (
          <div className={styles.noticeTip}>
            Como es la primera vez, calculamos {missingHistoryCount === recommendations.length ? 'todo' : 'algunos de estos'}{' '}
            asumiendo que nunca se le ha hecho mantenimiento. Si ya le hiciste algo, regístralo en{' '}
            <strong>Historial</strong> para afinar estas recomendaciones.
          </div>
        )}
        {groups.map((group) => (
          <div key={group.priority} className={styles.block}>
            <div className={styles.blockHead} style={{ color: PRIORITY_META[group.priority].color }}>
              <Circle size={10} fill="currentColor" /> {PRIORITY_META[group.priority].label}
            </div>
            <div className={styles.cardGrid}>
              {group.items.map((rec) => (
                <PriorityCard key={rec.item.id} recommendation={rec} onMarkDone={() => markDone(rec)} />
              ))}
            </div>
          </div>
        ))}

        {seasonalTip && (
          <div className={styles.seasonalTip}>
            <span className={styles.seasonalIcon}>
              <DrFlag size={18} />
            </span>
            <div>
              <div className={styles.seasonalTitle}>TIP REPÚBLICA DOMINICANA</div>
              <div className={styles.seasonalDesc}>{seasonalTip}</div>
            </div>
          </div>
        )}

        <div className={styles.legalReminder}>
          <FileText size={14} /> No olvides tus trámites anuales: <strong>marbete</strong> y{' '}
          <strong>seguro</strong>. Todavía no calculamos su vencimiento exacto — anótalo tú mismo
          por ahora.
        </div>
      </div>
    </div>
  );
}
