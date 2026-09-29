import { ChevronRight, ClipboardList, Gauge, LogOut, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatKm } from '../../core/format';
import { recommend } from '../../core/maintenance/engine';
import { summarizeRecommendations } from '../../core/maintenance/summary';
import type { VehicleCategory } from '../../core/types';
import { findCatalogModel } from '../../data/catalog';
import { findVehicleSpec } from '../../data/specs';
import { historyRepository, vehicleRepository } from '../../storage';
import {
  Badge,
  CarSilhouette,
  CATEGORY_ICON,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  STATUS_LABEL,
  STATUS_TONE,
} from '../../ui/components';
import { useShell } from '../../ui/layout/useShell';
import styles from './Profile.module.css';

const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  sedan: 'Sedán',
  hatchback: 'Hatchback',
  suv: 'SUV',
  pickup: 'Pickup',
};

const PREVIEW_COUNT = 2;

export function Profile() {
  const { onSignOut } = useShell();
  const vehicle = vehicleRepository.get();
  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!vehicle) return null;

  const fuelLabel = vehicle.fuelType === 'diesel' ? 'Diésel' : 'Gasolina';
  const catalogModel = findCatalogModel(vehicle.make, vehicle.model);
  const spec = catalogModel ? findVehicleSpec(catalogModel.id) : undefined;

  const recommendations =
    vehicle.currentKm === undefined
      ? []
      : recommend({
          vehicleYear: vehicle.year,
          currentKm: vehicle.currentKm,
          history: historyRepository.getAll(vehicle.id),
          today: new Date(),
        });
  const summary = vehicle.currentKm === undefined ? undefined : summarizeRecommendations(recommendations);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.crest}>RD</span>
          <span className={styles.appTitle}>Conoce tu vehículo</span>
        </div>
        <div className={styles.topActions}>
          {summary && (
            <Link
              to="/mantenimiento"
              className={styles.statusLink}
              aria-label={`Estado: ${STATUS_LABEL[summary.status]}. Ver servicios`}
            >
              <Badge tone={STATUS_TONE[summary.status]} shape="pill" dot>
                {STATUS_LABEL[summary.status]}
              </Badge>
            </Link>
          )}
          <button type="button" className={styles.iconButton} onClick={onSignOut} aria-label="Salir">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.col}>
          <section className={styles.hero} aria-labelledby="vehicle-name">
            <div className={styles.heroHeader}>
              <div>
                <h1 id="vehicle-name" className={styles.vehicleName}>
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className={styles.vehicleSub}>
                  {vehicle.year} · {vehicle.trim} · {fuelLabel}
                </p>
              </div>
              {catalogModel && (
                <span className={styles.categoryBadge}>{CATEGORY_LABEL[catalogModel.category]}</span>
              )}
            </div>

            <CarSilhouette />

            <dl className={styles.metrics}>
              <div className={styles.metric}>
                <dt>Odómetro</dt>
                <dd>{vehicle.currentKm === undefined ? 'Sin registrar' : formatKm(vehicle.currentKm)}</dd>
              </div>
              <div className={styles.metric}>
                <dt>Pendientes</dt>
                <dd>{summary ? summary.pending : '—'}</dd>
              </div>
              <div className={styles.metric}>
                <dt>Combustible</dt>
                <dd>{fuelLabel}</dd>
              </div>
            </dl>
            <Link to="/onboarding" className={styles.changeVehicle}>
              <RefreshCw size={14} /> Cambiar de vehículo
            </Link>
          </section>

          <section className={styles.quoteCard}>
            <h2 className={styles.quoteLabel}>
              <Sparkles size={14} /> Tu carro en pocas palabras
            </h2>
            <p className={styles.quoteBody}>
              {spec
                ? spec.description
                : 'Todavía no tenemos una ficha curada para este modelo. El mantenimiento sigue funcionando con recomendaciones generales.'}
            </p>
          </section>
        </div>

        <div className={styles.col}>
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Próximos servicios</h2>
              {recommendations.length > 0 && (
                <Link to="/mantenimiento" className={styles.seeAll}>
                  Ver todos ({recommendations.length}) <ChevronRight size={14} />
                </Link>
              )}
            </div>

            {recommendations.length === 0 ? (
              <Link to="/mantenimiento" className={styles.serviceRow}>
                <span className={styles.serviceIcon} aria-hidden="true">
                  <Gauge size={18} />
                </span>
                <span className={styles.serviceText}>
                  <span className={styles.serviceName}>Registra tu kilometraje</span>
                  <span className={styles.serviceDue}>Con eso calculamos qué le toca a tu carro y cuándo.</span>
                </span>
                <ChevronRight size={18} className={styles.chevron} />
              </Link>
            ) : (
              <ul className={styles.serviceList}>
                {recommendations.slice(0, PREVIEW_COUNT).map((rec) => {
                  const Icon = CATEGORY_ICON[rec.item.category];
                  return (
                    <li key={rec.item.id}>
                      <Link to="/mantenimiento" className={styles.serviceRow}>
                        <span className={styles.serviceIcon} aria-hidden="true">
                          <Icon size={18} />
                        </span>
                        <span className={styles.serviceText}>
                          <span className={styles.serviceName}>{rec.item.name}</span>
                          <span className={styles.serviceDue}>{rec.dueReason}</span>
                        </span>
                        <Badge tone={PRIORITY_TONE[rec.priority]}>{PRIORITY_LABEL[rec.priority]}</Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {spec && (
            <section>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <ClipboardList size={14} /> Datos clave
                </h2>
              </div>
              <dl className={styles.specs}>
                <div className={styles.spec}>
                  <dt>Aceite</dt>
                  <dd>
                    {spec.oilCapacity} · {spec.oilType}
                  </dd>
                </div>
                <div className={styles.spec}>
                  <dt>Gomas</dt>
                  <dd>{spec.tireSize}</dd>
                </div>
                <div className={styles.spec}>
                  <dt>Presión</dt>
                  <dd>{spec.tirePressure}</dd>
                </div>
                <div className={styles.spec}>
                  <dt>Combustible</dt>
                  <dd>{fuelLabel}</dd>
                </div>
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
