import { Car, CircleCheck, ClipboardList, Gauge, Users, Wrench } from 'lucide-react';
import { getAccessoryGroups } from '../../data/accessories';
import { findCatalogModel } from '../../data/catalog';
import { communitySearchUrl, findVehicleSpec } from '../../data/specs';
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
  const accessoryGroups = getAccessoryGroups(spec?.accessories ?? [], catalogModel, vehicle.trim);

  if (!spec) {
    return (
      <div>
        <TopBar
          title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
          subtitle={`${vehicle.trim} · ${fuelLabel}`}
          icon={<Car size={20} />}
          gradient
        />
        <div className={styles.body}>
          <p className={styles.honest}>
            Todavía no tenemos una ficha curada para este modelo. Estamos agregando más
            vehículos poco a poco — mientras tanto, el Mantenimiento sigue funcionando con
            recomendaciones generales.
          </p>

          <div className={styles.sectionTitle}>
            <Wrench size={13} /> Accesorios recomendados
          </div>
          {accessoryGroups.map((group) => (
            <div key={group.title} className={styles.accessoryGroup}>
              <p className={styles.accessoryGroupTitle}>{group.title}</p>
              <div className={styles.chips}>
                {group.items.map((a) => (
                  <Chip key={a}>{a}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar
        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        subtitle={`${vehicle.trim} · ${fuelLabel}`}
        icon={<Car size={20} />}
        gradient
      />
      <div className={styles.body}>
        <div className={styles.grid}>
          <div className={styles.colLeft}>
            <div className={styles.sectionTitle}>Tu carro en pocas palabras</div>
            <blockquote className={styles.quote}>"{spec.description}"</blockquote>

            <div className={styles.sectionTitle}>
              <CircleCheck size={13} /> Cómo tratarlo bien
            </div>
            {spec.careTips.map((tip) => (
              <div key={tip.title} className={styles.tipCard}>
                <div className={styles.tipIcon}>{tip.icon}</div>
                <div>
                  <div className={styles.tipTitle}>{tip.title}</div>
                  <div className={styles.tipDesc}>{tip.description}</div>
                </div>
              </div>
            ))}

            <div className={styles.sectionTitle}>
              <Gauge size={13} /> Mejor rendimiento
            </div>
            {spec.performanceTips.map((tip) => (
              <div key={tip.title} className={styles.tipCard}>
                <div className={styles.tipIcon}>{tip.icon}</div>
                <div>
                  <div className={styles.tipTitle}>{tip.title}</div>
                  <div className={styles.tipDesc}>{tip.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.colRight}>
            <div className={styles.sectionTitle}>
            <Wrench size={13} /> Accesorios recomendados
          </div>
            {accessoryGroups.map((group) => (
              <div key={group.title} className={styles.accessoryGroup}>
                <p className={styles.accessoryGroupTitle}>{group.title}</p>
                <div className={styles.chips}>
                  {group.items.map((a) => (
                    <Chip key={a}>{a}</Chip>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.sectionTitle}>
              <Users size={13} /> {spec.communities.length > 1 ? 'Comunidades' : 'Comunidad'}
            </div>
            {spec.communities.map((c) => (
              <a
                key={c.name}
                href={communitySearchUrl(c.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.communityCard}
              >
                <div className={styles.communityIcon}>
                  <Users size={16} />
                </div>
                <div>
                  <div className={styles.tipTitle}>{c.name}</div>
                  <div className={styles.tipDesc}>{c.platform} · buscar grupo →</div>
                </div>
              </a>
            ))}

            <div className={styles.sectionTitle}>
              <ClipboardList size={13} /> Datos clave
            </div>
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
      </div>
    </div>
  );
}
