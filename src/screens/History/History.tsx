import { ClipboardList, History as HistoryIcon, Plus, Wrench } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { formatMonthYear, toLocalIsoDate } from '../../core/date';
import { formatCurrency, formatKm } from '../../core/format';
import { validateHistoryDraft, type HistoryDraftErrors } from '../../core/history/validate';
import { MAINTENANCE_CATALOG } from '../../core/maintenance/catalog';
import type { HistoryEntry, Vehicle } from '../../core/types';
import posthog, { posthogEnabled } from '../../lib/posthog.ts';
import { historyRepository, vehicleRepository } from '../../storage';
import { Button, CATEGORY_ICON, SearchableList, TopBar } from '../../ui/components';
import styles from './History.module.css';

const OTHER_OPTION = { id: 'other', name: 'Otro (especificar)' };
const ITEM_OPTIONS = [...MAINTENANCE_CATALOG.map((i) => ({ id: i.id, name: i.name })), OTHER_OPTION];

interface FormState {
  itemId: string;
  customDescription: string;
  date: string;
  km: string;
  cost: string;
  shop: string;
}

function emptyForm(defaultKm?: number): FormState {
  return {
    itemId: '',
    customDescription: '',
    date: toLocalIsoDate(new Date()),
    km: defaultKm !== undefined ? String(defaultKm) : '',
    cost: '',
    shop: '',
  };
}

function iconFor(entry: HistoryEntry) {
  const item = MAINTENANCE_CATALOG.find((i) => i.id === entry.itemId);
  return item ? CATEGORY_ICON[item.category] : Wrench;
}

export function History() {
  const fieldId = useId();
  const maybeVehicle = vehicleRepository.get();
  const [entries, setEntries] = useState<HistoryEntry[]>(() =>
    maybeVehicle ? historyRepository.getAll(maybeVehicle.id) : [],
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(maybeVehicle?.currentKm));
  const [errors, setErrors] = useState<HistoryDraftErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (showForm) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      formRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [showForm, editingId]);

  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!maybeVehicle) return null;
  const vehicle: Vehicle = maybeVehicle;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const total = entries.reduce((sum, e) => sum + (e.costDOP ?? 0), 0);
  const latest = sorted[0];
  const ids = {
    item: `${fieldId}-item`,
    custom: `${fieldId}-custom`,
    date: `${fieldId}-date`,
    km: `${fieldId}-km`,
    cost: `${fieldId}-cost`,
    shop: `${fieldId}-shop`,
  };

  function openAdd() {
    setEditingId(null);
    setErrors({});
    setForm(emptyForm(vehicle.currentKm));
    setShowForm(true);
  }

  function openEdit(entry: HistoryEntry) {
    setEditingId(entry.id);
    setErrors({});
    setConfirmingId(null);
    const matched = MAINTENANCE_CATALOG.find((i) => i.id === entry.itemId);
    setForm({
      itemId: matched ? matched.id : 'other',
      customDescription: matched ? '' : entry.description,
      date: entry.date,
      km: String(entry.km),
      cost: entry.costDOP !== undefined ? String(entry.costDOP) : '',
      shop: entry.shop ?? '',
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  }

  function submitForm() {
    const matched = MAINTENANCE_CATALOG.find((i) => i.id === form.itemId);
    const description = matched ? matched.name : form.itemId === 'other' ? form.customDescription : '';
    const result = validateHistoryDraft(
      { description, date: form.date, km: form.km, cost: form.cost },
      new Date(),
    );
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    const { km } = result.value;
    const entry: HistoryEntry = {
      id: editingId ?? crypto.randomUUID(),
      vehicleId: vehicle.id,
      itemId: matched?.id,
      ...result.value,
      shop: form.shop.trim() || undefined,
    };

    if (editingId) {
      historyRepository.update(entry);
      setEntries((prev) => prev.map((e) => (e.id === editingId ? entry : e)));
    } else {
      historyRepository.add(entry);
      setEntries((prev) => [...prev, entry]);
    }
    if (posthogEnabled) {
      posthog.capture(editingId ? 'maintenance_entry_updated' : 'maintenance_entry_created', {
        item_id: matched?.id ?? 'other',
      });
    }

    // Si el registro trae el kilometraje más alto conocido, actualiza el odómetro.
    if (vehicle.currentKm === undefined || km > vehicle.currentKm) {
      vehicleRepository.save({ ...vehicle, currentKm: km });
    }

    setShowForm(false);
    setEditingId(null);
    setErrors({});
  }

  function removeEntry(id: string) {
    historyRepository.remove(id);
    if (posthogEnabled) posthog.capture('maintenance_entry_deleted');
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setConfirmingId(null);
  }

  function fieldProps(field: keyof HistoryDraftErrors, id: string) {
    return {
      id,
      'aria-invalid': errors[field] ? true : undefined,
      'aria-describedby': errors[field] ? `${id}-error` : undefined,
    };
  }

  function errorFor(field: keyof HistoryDraftErrors, id: string) {
    return errors[field] ? (
      <p id={`${id}-error`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;
  }

  let lastGroup = '';

  return (
    <div>
      <TopBar
        title="Historial"
        subtitle="La hoja de vida de tu carro"
        icon={<HistoryIcon size={20} />}
      />
      <div className={styles.body}>
        <div className={`${styles.grid} ${showForm ? styles.gridWithForm : ''}`}>
          <div className={styles.colMain}>
            <section className={styles.summary}>
              <h2 className={styles.summaryLabel}>Último registro</h2>
              <p className={styles.summaryValue}>{latest ? latest.description : 'Nada registrado todavía'}</p>
              {latest && (
                <p className={styles.summaryMeta}>
                  {formatKm(latest.km)} · {formatMonthYear(latest.date)}
                </p>
              )}
              <dl className={styles.metrics}>
                <div>
                  <dt>Registros</dt>
                  <dd>{entries.length}</dd>
                </div>
                <div>
                  <dt>Gasto total</dt>
                  <dd>{formatCurrency(total)}</dd>
                </div>
              </dl>
            </section>

            {sorted.length === 0 && !showForm && (
              <div className={styles.empty}>
                <ClipboardList size={28} aria-hidden="true" />
                <p>
                  Anota aquí cada cambio de aceite, goma o reparación. Con eso las recomendaciones de
                  Servicios se ajustan a tu carro de verdad.
                </p>
              </div>
            )}

            {sorted.length > 0 && (
              <ol className={styles.timeline}>
                {sorted.map((entry) => {
                  const group = formatMonthYear(entry.date);
                  const showGroup = group !== lastGroup;
                  lastGroup = group;
                  const Icon = iconFor(entry);
                  const confirming = confirmingId === entry.id;
                  return (
                    <li key={entry.id}>
                      {showGroup && <h3 className={styles.groupLabel}>{group}</h3>}
                      <article className={styles.event}>
                        <div className={styles.eventRow}>
                          <span className={styles.eventIcon} aria-hidden="true">
                            <Icon size={16} />
                          </span>
                          <div className={styles.eventText}>
                            <div className={styles.eventTitle}>{entry.description}</div>
                            <div className={styles.eventSub}>
                              {entry.shop ? `${entry.shop} · ` : ''}
                              {formatKm(entry.km)}
                            </div>
                          </div>
                          {entry.costDOP !== undefined && (
                            <div className={styles.eventCost}>{formatCurrency(entry.costDOP)}</div>
                          )}
                        </div>
                        {confirming ? (
                          <div className={styles.confirm} role="group" aria-label="Confirmar eliminación">
                            <span>¿Eliminar este registro?</span>
                            <button
                              type="button"
                              className={`${styles.linkBtn} ${styles.danger}`}
                              onClick={() => removeEntry(entry.id)}
                            >
                              Sí, eliminar
                            </button>
                            <button type="button" className={styles.linkBtn} onClick={() => setConfirmingId(null)}>
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className={styles.eventActions}>
                            <button type="button" className={styles.linkBtn} onClick={() => openEdit(entry)}>
                              Editar
                            </button>
                            <button
                              type="button"
                              className={`${styles.linkBtn} ${styles.danger}`}
                              onClick={() => setConfirmingId(entry.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ol>
            )}

            {!showForm && (
              <Button onClick={openAdd}>
                <Plus size={18} /> Agregar registro
              </Button>
            )}
          </div>

          {showForm && (
            <div className={styles.colForm}>
              <form
                ref={formRef}
                className={styles.form}
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
              >
                <h2 className={styles.formTitle}>{editingId ? 'Editar registro' : 'Nuevo registro'}</h2>

                <label className={styles.label} htmlFor={ids.item}>
                  ¿Qué se hizo?
                </label>
                {form.itemId !== 'other' && errorFor('description', ids.item)}
                <SearchableList
                  inputId={ids.item}
                  items={ITEM_OPTIONS}
                  getKey={(i) => i.id}
                  getLabel={(i) => i.name}
                  selectedKey={form.itemId || undefined}
                  onSelect={(i) => setForm((f) => ({ ...f, itemId: i.id }))}
                  placeholder="Buscar servicio..."
                />
                {form.itemId === 'other' && (
                  <>
                    <label className={styles.label} htmlFor={ids.custom}>
                      Describe qué se hizo
                    </label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Ej. Cambio de bombillo"
                      value={form.customDescription}
                      onChange={(e) => setForm((f) => ({ ...f, customDescription: e.target.value }))}
                      {...fieldProps('description', ids.custom)}
                    />
                    {errorFor('description', ids.custom)}
                  </>
                )}

                <label className={styles.label} htmlFor={ids.date}>
                  Fecha
                </label>
                <input
                  className={styles.input}
                  type="date"
                  max={toLocalIsoDate(new Date())}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  {...fieldProps('date', ids.date)}
                />
                {errorFor('date', ids.date)}

                <label className={styles.label} htmlFor={ids.km}>
                  Kilometraje
                </label>
                <input
                  className={styles.input}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Ej. 98500"
                  value={form.km}
                  onChange={(e) => setForm((f) => ({ ...f, km: e.target.value }))}
                  {...fieldProps('km', ids.km)}
                />
                {errorFor('km', ids.km)}

                <label className={styles.label} htmlFor={ids.cost}>
                  Costo en RD$ (opcional)
                </label>
                <input
                  className={styles.input}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Ej. 2500"
                  value={form.cost}
                  onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                  {...fieldProps('cost', ids.cost)}
                />
                {errorFor('cost', ids.cost)}

                <label className={styles.label} htmlFor={ids.shop}>
                  Taller (opcional)
                </label>
                <input
                  id={ids.shop}
                  className={styles.input}
                  type="text"
                  placeholder="Ej. Taller Marte"
                  value={form.shop}
                  onChange={(e) => setForm((f) => ({ ...f, shop: e.target.value }))}
                />

                <div className={styles.formActions}>
                  <Button variant="ghost" onClick={cancelForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
