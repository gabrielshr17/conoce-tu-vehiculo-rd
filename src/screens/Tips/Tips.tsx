import { CircleCheck, Gauge, ShieldCheck, Users, Wrench } from 'lucide-react';
import { getAccessoryGroups } from '../../data/accessories';
import { findCatalogModel } from '../../data/catalog';
import { communitySearchUrl, findVehicleSpec } from '../../data/specs';
import { vehicleRepository } from '../../storage';
import { Chip, TopBar } from '../../ui/components';
import styles from './Tips.module.css';

export function Tips() {
  const vehicle = vehicleRepository.get();
  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!vehicle) return null;

  const catalogModel = findCatalogModel(vehicle.make, vehicle.model);
  const spec = catalogModel ? findVehicleSpec(catalogModel.id) : undefined;
  const accessoryGroups = getAccessoryGroups(spec?.accessories ?? [], catalogModel, vehicle.trim);

  const accessories = (
    <>
      <h3 className={styles.sectionTitle}>
        <Wrench size={14} /> Accesorios recomendados
      </h3>
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
    </>
  );

  return (
    <div>
      <TopBar
        title="Consejos"
        subtitle={`Para tu ${vehicle.make} ${vehicle.model}`}
        icon={<ShieldCheck size={20} />}
      />
      <div className={styles.body}>
        {!spec ? (
          <>
            <p className={styles.honest}>
              Todavía no tenemos consejos curados para este modelo. Estamos agregando más vehículos
              poco a poco — mientras tanto, el Mantenimiento sigue funcionando con recomendaciones
              generales.
            </p>
            {accessories}
          </>
        ) : (
          <div className={styles.grid}>
            <div>
              <h3 className={styles.sectionTitle}>
                <CircleCheck size={14} /> Cómo tratarlo bien
              </h3>
              {spec.careTips.map((tip) => (
                <div key={tip.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>{tip.icon}</div>
                  <div>
                    <div className={styles.tipTitle}>{tip.title}</div>
                    <div className={styles.tipDesc}>{tip.description}</div>
                  </div>
                </div>
              ))}

              <h3 className={styles.sectionTitle}>
                <Gauge size={14} /> Mejor rendimiento
              </h3>
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

            <div>
              {accessories}

              <h3 className={styles.sectionTitle}>
                <Users size={14} /> {spec.communities.length > 1 ? 'Comunidades' : 'Comunidad'}
              </h3>
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
                    <div className={styles.tipDesc}>{c.platform} · buscar grupo</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
