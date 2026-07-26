import { useState } from 'react';
import { formatCurrency, formatKm } from '../../core/format';
import { MAINTENANCE_CATALOG } from '../../core/maintenance/catalog';
import type { HistoryEntry, Vehicle } from '../../core/types';
import { historyRepository, vehicleRepository } from '../../storage';
import { Button, SearchableList, TopBar } from '../../ui/components';
import styles from './History.module.css';

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const OTHER_OPTION = { id: 'other', name: 'Otro (especificar)' };
const ITEM_OPTIONS = [...MAINTENANCE_CATALOG.map((i) => ({ id: i.id, name: i.name })), OTHER_OPTION];

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`.toUpperCase();
}

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
    date: new Date().toISOString().slice(0, 10),
    km: defaultKm !== undefined ? String(defaultKm) : '',
    cost: '',
    shop: '',
  };
}

export function History() {
  const maybeVehicle = vehicleRepository.get();
  const [entries, setEntries] = useState<HistoryEntry[]>(() =>
    maybeVehicle ? historyRepository.getAll(maybeVehicle.id) : [],
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(maybeVehicle?.currentKm));

  // AppShell garantiza que exista un vehículo antes de renderizar esta ruta.
  if (!maybeVehicle) return null;
  const vehicle: Vehicle = maybeVehicle;

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const total = entries.reduce((sum, e) => sum + (e.costDOP ?? 0), 0);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm(vehicle.currentKm));
    setShowForm(true);
  }

  function openEdit(entry: HistoryEntry) {
    setEditingId(entry.id);
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
  }

  function submitForm() {
    const km = Number(form.km);
    if (!form.itemId || !Number.isFinite(km) || km < 0 || !form.date) return;

    const matched = MAINTENANCE_CATALOG.find((i) => i.id === form.itemId);
    const description = matched ? matched.name : form.customDescription.trim();
    if (!description) return;

    const entry: HistoryEntry = {
      id: editingId ?? crypto.randomUUID(),
      vehicleId: vehicle.id,
      itemId: matched?.id,
      description,
      date: form.date,
      km,
      costDOP: form.cost ? Number(form.cost) : undefined,
      shop: form.shop.trim() || undefined,
    };

    if (editingId) {
      historyRepository.update(entry);
      setEntries((prev) => prev.map((e) => (e.id === editingId ? entry : e)));
    } else {
      historyRepository.add(entry);
      setEntries((prev) => [...prev, entry]);
    }

    // Si el registro trae el kilometraje más alto conocido, actualiza el odómetro.
    if (vehicle.currentKm === undefined || km > vehicle.currentKm) {
      vehicleRepository.save({ ...vehicle, currentKm: km });
    }

    setShowForm(false);
    setEditingId(null);
  }

  function removeEntry(id: string) {
    historyRepository.remove(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  let lastGroup = '';

  return (
    <div>
      <TopBar title="Historial" subtitle="La hoja de vida de tu carro" icon="📋" gradient />
      <div className={styles.body}>
      <div className={`${styles.grid} ${showForm ? styles.gridWithForm : ''}`}>
      <div className={styles.colMain}>
        {sorted.length > 0 && (
          <div className={styles.lastEntry}>
            <div className={styles.specKey}>Último registro</div>
            <div className={styles.specValue}>{sorted[0].description}</div>
            <div className={styles.lastEntryMeta}>
              {formatKm(sorted[0].km)} · {monthLabel(sorted[0].date).toLowerCase()}
            </div>
          </div>
        )}
        <div className={styles.specs}>
          <div className={styles.spec}>
            <div className={styles.specKey}>Registros</div>
            <div className={styles.specValue}>{entries.length}</div>
          </div>
          <div className={styles.spec}>
            <div className={styles.specKey}>Gasto total</div>
            <div className={styles.specValue}>{formatCurrency(total)}</div>
          </div>
        </div>

        {sorted.length === 0 && !showForm && (
          <p className={styles.empty}>Todavía no tienes registros. Agrega el primero.</p>
        )}

        {sorted.length > 0 && (
          <div className={styles.timeline}>
            {sorted.map((entry) => {
              const group = monthLabel(entry.date);
              const showGroup = group !== lastGroup;
              lastGroup = group;
              return (
                <div key={entry.id}>
                  {showGroup && <div className={styles.groupLabel}>{group}</div>}
                  <div className={styles.event}>
                    <div className={styles.eventRow}>
                      <div>
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
                    <div className={styles.eventActions}>
                      <button type="button" className={styles.linkBtn} onClick={() => openEdit(entry)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.linkBtn} ${styles.danger}`}
                        onClick={() => removeEntry(entry.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!showForm && (
          <button type="button" className={styles.addBtn} onClick={openAdd}>
            ＋ Agregar registro
          </button>
        )}
      </div>

        {showForm && (
          <div className={styles.colForm}>
          <div className={styles.form}>
            <div className={styles.formTitle}>{editingId ? 'Editar registro' : 'Nuevo registro'}</div>

            <label className={styles.label}>¿Qué se hizo?</label>
            <SearchableList
              items={ITEM_OPTIONS}
              getKey={(i) => i.id}
              getLabel={(i) => i.name}
              selectedKey={form.itemId || undefined}
              onSelect={(i) => setForm((f) => ({ ...f, itemId: i.id }))}
              placeholder="Buscar..."
            />
            {form.itemId === 'other' && (
              <input
                className={styles.input}
                type="text"
                placeholder="Describe qué se hizo"
                value={form.customDescription}
                onChange={(e) => setForm((f) => ({ ...f, customDescription: e.target.value }))}
              />
            )}

            <label className={styles.label}>Fecha</label>
            <input
              className={styles.input}
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />

            <label className={styles.label}>Kilometraje</label>
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              placeholder="Ej. 98500"
              value={form.km}
              onChange={(e) => setForm((f) => ({ ...f, km: e.target.value }))}
            />

            <label className={styles.label}>Costo en RD$ (opcional)</label>
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              placeholder="Ej. 2500"
              value={form.cost}
              onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
            />

            <label className={styles.label}>Taller (opcional)</label>
            <input
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
              <Button onClick={submitForm}>Guardar</Button>
            </div>
          </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
