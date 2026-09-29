import { Clock, FileText, Gauge, Info, ShieldCheck, TriangleAlert, Wrench, type LucideIcon } from 'lucide-react';
import { useCallback, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toLocalIsoDate } from '../../core/date';
import { formatKm } from '../../core/format';
import { recommend } from '../../core/maintenance/engine';
import { getSeasonalTip } from '../../core/maintenance/rdModifiers';
import { summarizeRecommendations, type VehicleStatus } from '../../core/maintenance/summary';
import { validateOdometer } from '../../core/odometer';
import type { HistoryEntry, Priority, Recommendation, Vehicle } from '../../core/types';
import { historyRepository, vehicleRepository } from '../../storage';
import { Button, DrFlag, PRIORITY_LABEL, PriorityCard, Toast, TopBar } from '../../ui/components';
import styles from './Maintenance.module.css';

type Filter = 'all' | Priority;

const FILTER_ORDER: Priority[] = ['urgent', 'soon', 'later'];

const STATUS_HEADLINE: Record<VehicleStatus, { title: string; icon: LucideIcon }> = {
  ok: { title: 'Todo al día', icon: ShieldCheck },
  soon: { title: 'Servicio pronto', icon: Clock },
  urgent: { title: 'Requiere atención', icon: TriangleAlert },
};

export function Maintenance() {
  const maybeVehicle = vehicleRepository.get();
  const [currentKm, setCurrentKm] = useState(maybeVehicle?.currentKm);
  const [kmInput, setKmInput] = useState('');
  const [editingKm, setEditingKm] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    maybeVehicle ? historyRepository.getAll(maybeVehicle.id) : [],
  );
  const [kmError, setKmError] = useState<string | null>(null);
  const [lastDone, setLastDone] = useState<HistoryEntry | null>(null);
  const dismissToast = useCallback(() => setLastDone(null), []);

  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!maybeVehicle) return null;
  const vehicle: Vehicle = maybeVehicle;

  function saveOdometer(event?: FormEvent) {
    event?.preventDefault();
    const result = validateOdometer(kmInput, history);
    if (!result.ok) {
      setKmError(result.error);
      return;
    }
    vehicleRepository.save({ ...vehicle, currentKm: result.km });
    setCurrentKm(result.km);
    setKmInput('');
    setKmError(null);
    setEditingKm(false);
  }

  function updateKmInput(value: string) {
    setKmInput(value);
    setKmError(null);
  }

  const kmErrorNode = kmError && (
    <p id="km-error" className={styles.kmError}>
      {kmError}
    </p>
  );

  if (currentKm === undefined) {
    return (
      <div>
        <TopBar title="Plan de mantenimiento" icon={<Wrench size={20} />} />
        <form className={styles.body} onSubmit={saveOdometer}>
          <p className={styles.ask}>¿Cuántos kilómetros tiene tu carro ahora?</p>
          <p className={styles.muted}>
            Es el número del odómetro, en el tablero detrás del guía. Con eso sabemos qué le toca a tu
            carro y para cuándo.
          </p>
          <input
            className={styles.kmInput}
            type="number"
            inputMode="numeric"
            placeholder="Ej. 98500"
            aria-label="Kilometraje actual"
            aria-invalid={kmError ? true : undefined}
            aria-describedby={kmError ? 'km-error' : undefined}
            value={kmInput}
            onChange={(e) => updateKmInput(e.target.value)}
          />
          {kmErrorNode}
          <Button type="submit" disabled={!kmInput.trim()}>
            Ver mi mantenimiento
          </Button>
        </form>
      </div>
    );
  }

  const today = new Date();
  const recommendations = recommend({ vehicleYear: vehicle.year, currentKm, history, today });
  const summary = summarizeRecommendations(recommendations);
  const seasonalTip = getSeasonalTip(today);
  const headline = STATUS_HEADLINE[summary.status];
  const activeFilter: Filter = filter !== 'all' && summary.counts[filter] === 0 ? 'all' : filter;
  const visible =
    activeFilter === 'all' ? recommendations : recommendations.filter((r) => r.priority === activeFilter);

  function markDone(rec: Recommendation) {
    if (currentKm === undefined) return;
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      itemId: rec.item.id,
      description: rec.item.name,
      date: toLocalIsoDate(today),
      km: currentKm,
    };
    historyRepository.add(entry);
    setHistory((prev) => [...prev, entry]);
    setLastDone(entry);
  }

  function undoLastDone() {
    if (!lastDone) return;
    historyRepository.remove(lastDone.id);
    setHistory((prev) => prev.filter((e) => e.id !== lastDone.id));
    setLastDone(null);
  }

  const missingHistoryCount = recommendations.filter((r) => !r.hasHistory).length;
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: recommendations.length },
    ...FILTER_ORDER.filter((p) => summary.counts[p] > 0).map((p) => ({
      id: p,
      label: PRIORITY_LABEL[p],
      count: summary.counts[p],
    })),
  ];

  return (
    <div>
      <TopBar
        title="Plan de mantenimiento"
        subtitle={`${vehicle.make} ${vehicle.model} · ${formatKm(currentKm)}`}
        actions={
          <button
            type="button"
            className={styles.editKm}
            aria-expanded={editingKm}
            onClick={() => {
              setEditingKm((v) => !v);
              setKmError(null);
            }}
          >
            <Gauge size={14} /> Editar km
          </button>
        }
      />
      <div className={styles.body}>
        {editingKm && (
          <form className={styles.kmEdit} onSubmit={saveOdometer}>
            <div className={styles.kmForm}>
              <input
                className={styles.kmInput}
                type="number"
                inputMode="numeric"
                placeholder={String(currentKm)}
                aria-label="Nuevo kilometraje"
                aria-invalid={kmError ? true : undefined}
                aria-describedby={kmError ? 'km-error' : undefined}
                value={kmInput}
                onChange={(e) => updateKmInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.kmSave} disabled={!kmInput.trim()}>
                Guardar
              </button>
            </div>
            {kmErrorNode}
          </form>
        )}

        <section className={`${styles.summary} ${styles[summary.status]}`} aria-live="polite">
          <div>
            <h2 className={styles.summaryLabel}>Estado general</h2>
            <p className={styles.summaryValue}>{headline.title}</p>
            <p className={styles.summaryHint}>
              {summary.pending === 0
                ? 'Nada pendiente por ahora'
                : `${summary.pending} ${summary.pending === 1 ? 'servicio pendiente' : 'servicios pendientes'}`}
            </p>
          </div>
          <span className={styles.ring} aria-hidden="true">
            <headline.icon size={24} />
          </span>
        </section>

        {missingHistoryCount > 0 && (
          <div className={styles.noticeTip}>
            <Info size={18} aria-hidden="true" />
            <p>
              {missingHistoryCount === recommendations.length ? 'Todos estos cálculos asumen' : `${missingHistoryCount} de estos cálculos asumen`}{' '}
              que nunca se le ha hecho ese servicio. Si ya se lo hiciste,{' '}
              <Link to="/historial">anótalo en Historial</Link> y la recomendación se ajusta.
            </p>
          </div>
        )}

        <div className={styles.filters} role="group" aria-label="Filtrar servicios">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.filter} ${activeFilter === f.id ? styles.filterOn : ''}`}
              aria-pressed={activeFilter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        <div className={styles.cardGrid}>
          {visible.map((rec) => (
            <PriorityCard key={rec.item.id} recommendation={rec} onMarkDone={() => markDone(rec)} />
          ))}
        </div>

        {seasonalTip && (
          <div className={styles.seasonalTip}>
            <span className={styles.seasonalIcon}>
              <DrFlag size={18} />
            </span>
            <div>
              <div className={styles.seasonalTitle}>Tip República Dominicana</div>
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
      {lastDone && (
        <Toast
          message={`${lastDone.description} registrado en Historial`}
          actionLabel="Deshacer"
          onAction={undoLastDone}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}
