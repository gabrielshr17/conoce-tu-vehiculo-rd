import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '../../core/types';
import { findCatalogModel, getMakes, getModelsByMake, getTrims, getYears } from '../../data/catalog';
import { vehicleRepository } from '../../storage';
import { Button, SearchableList, Stepper, TopBar } from '../../ui/components';
import styles from './Onboarding.module.css';

const TOTAL_STEPS = 4;

const STEP_META = [
  { question: '¿De qué año es?', placeholder: 'Buscar año...' },
  { question: '¿Cuál es la marca?', placeholder: 'Buscar marca...' },
  { question: '¿Cuál es el modelo?', placeholder: 'Buscar modelo...' },
  { question: '¿Cuál es la versión?', placeholder: 'Buscar versión...' },
] as const;

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [year, setYear] = useState<number>();
  const [make, setMake] = useState<string>();
  const [model, setModel] = useState<string>();
  const [trim, setTrim] = useState<string>();

  const years = getYears();
  const makes = getMakes();
  const models = make ? getModelsByMake(make) : [];
  const trims = make && model ? getTrims(make, model) : [];

  const canAdvance =
    (step === 1 && year !== undefined) ||
    (step === 2 && make !== undefined) ||
    (step === 3 && model !== undefined) ||
    (step === 4 && trim !== undefined);

  function handleBack() {
    if (step === 1) {
      navigate('/');
    } else {
      setStep(step - 1);
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    if (!year || !make || !model || !trim) return;

    const catalogModel = findCatalogModel(make, model);
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      year,
      make,
      model,
      trim,
      fuelType: catalogModel?.fuelType ?? 'gasolina',
      createdAt: new Date().toISOString(),
    };
    vehicleRepository.save(vehicle);
    navigate('/perfil');
  }

  const { question, placeholder } = STEP_META[step - 1];

  return (
    <div>
      <TopBar title="Identifica tu vehículo" subtitle={`Paso ${step} de ${TOTAL_STEPS}`} onBack={handleBack} />
      <div className={styles.body}>
        <div className={styles.stepperWrap}>
          <Stepper total={TOTAL_STEPS} current={step} />
        </div>
        <div className={styles.qbig}>{question}</div>
        <p className={styles.muted}>Elígelo de la lista, no hace falta escribir.</p>

        {step === 1 && (
          <SearchableList
            items={years}
            getKey={(y) => String(y)}
            getLabel={(y) => String(y)}
            selectedKey={year !== undefined ? String(year) : undefined}
            onSelect={setYear}
            placeholder={placeholder}
          />
        )}
        {step === 2 && (
          <SearchableList
            items={makes}
            getKey={(m) => m}
            getLabel={(m) => m}
            selectedKey={make}
            onSelect={(m) => {
              setMake(m);
              setModel(undefined);
              setTrim(undefined);
            }}
            placeholder={placeholder}
          />
        )}
        {step === 3 && (
          <SearchableList
            items={models}
            getKey={(m) => m.id}
            getLabel={(m) => m.model}
            selectedKey={models.find((m) => m.model === model)?.id}
            onSelect={(m) => {
              setModel(m.model);
              setTrim(undefined);
            }}
            placeholder={placeholder}
          />
        )}
        {step === 4 && (
          <SearchableList
            items={trims}
            getKey={(t) => t}
            getLabel={(t) => t}
            selectedKey={trim}
            onSelect={setTrim}
            placeholder={placeholder}
          />
        )}

        <div className={styles.navrow}>
          <Button variant="ghost" onClick={handleBack}>
            ← Atrás
          </Button>
          <Button disabled={!canAdvance} onClick={handleNext}>
            {step === TOTAL_STEPS ? 'Ver mi perfil →' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
