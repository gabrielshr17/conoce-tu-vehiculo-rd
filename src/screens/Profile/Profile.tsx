import { findCatalogModel } from '../../data/catalog';
import { findVehicleSpec } from '../../data/specs';
import { vehicleRepository } from '../../storage';
import { Chip, TopBar } from '../../ui/components';
import styles from './Profile.module.css';

export function Profile() {
  const vehicle = vehicleRepository.get();
  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!vehicle) return null;

  const fuelLabel = vehicle.fuelType === 'diesel' ? 'Diésel' : 'Gasolina';
  const catalogModel = findCatalogModel(vehicle.make, vehicle.model);
  const spec = catalogModel ? findVehicleSpec(catalogModel.id) : undefined;

  if (!spec) {
    return (
      <div>
        <TopBar
          title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
          subtitle={`${vehicle.trim} · ${fuelLabel}`}
          icon="🚙"
          gradient
        />
        <div className={styles.body}>
          <p className={styles.honest}>
            Todavía no tenemos una ficha curada para este modelo. Estamos agregando más
            vehículos poco a poco — mientras tanto, el Mantenimiento sigue funcionando con
            recomendaciones generales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        subtitle={`${vehicle.trim} · ${fuelLabel}`}
        icon="🚙"
        gradient
      />
      <div className={styles.body}>
        <div className={styles.sectionTitle}>Tu carro en pocas palabras</div>
        <blockquote className={styles.quote}>"{spec.description}"</blockquote>

        <div className={styles.sectionTitle}>✅ Cómo tratarlo bien</div>
        {spec.careTips.map((tip) => (
          <div key={tip.title} className={styles.tipCard}>
            <div className={styles.tipIcon}>{tip.icon}</div>
            <div>
              <div className={styles.tipTitle}>{tip.title}</div>
              <div className={styles.tipDesc}>{tip.description}</div>
            </div>
          </div>
        ))}

        <div className={styles.sectionTitle}>💪 Mejor rendimiento</div>
        {spec.performanceTips.map((tip) => (
          <div key={tip.title} className={styles.tipCard}>
            <div className={styles.tipIcon}>{tip.icon}</div>
            <div>
              <div className={styles.tipTitle}>{tip.title}</div>
              <div className={styles.tipDesc}>{tip.description}</div>
            </div>
          </div>
        ))}

        <div className={styles.sectionTitle}>🛠️ Accesorios recomendados</div>
        <div className={styles.chips}>
          {spec.accessories.map((a) => (
            <Chip key={a}>{a}</Chip>
          ))}
        </div>

        <div className={styles.sectionTitle}>👥 Comunidad</div>
        <div className={styles.communityCard}>
          <div>📘</div>
          <div>
            <div className={styles.tipTitle}>{spec.community.name}</div>
            <div className={styles.tipDesc}>{spec.community.platform}</div>
          </div>
        </div>

        <div className={styles.sectionTitle}>📋 Datos clave</div>
        <div className={styles.specs}>
          <div className={styles.spec}>
            <div className={styles.specKey}>Combustible</div>
            <div className={styles.specValue}>{fuelLabel}</div>
          </div>
          <div className={styles.spec}>
            <div className={styles.specKey}>Aceite</div>
            <div className={styles.specValue}>
              {spec.oilCapacity} · {spec.oilType}
            </div>
          </div>
          <div className={styles.spec}>
            <div className={styles.specKey}>Gomas</div>
            <div className={styles.specValue}>{spec.tireSize}</div>
          </div>
          <div className={styles.spec}>
            <div className={styles.specKey}>Presión</div>
            <div className={styles.specValue}>{spec.tirePressure}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
