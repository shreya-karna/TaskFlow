
import { useState } from 'react';

const steps = [
  {
    title: 'Welcome to TaskFlow!',
    description:
      'This is your personal task manager. Let’s take a quick tour to learn how to organize your work and stay on track.',
    icon: '👋',
  },
  {
    title: 'Create a task',
    description:
      'Use the Add a task field at the top. Enter a title, select a priority, choose a due date if needed, and click Add task.',
    icon: '📝',
  },
  {
    title: 'Organize your work',
    description:
      'Your tasks are organized into To do, In progress, and Done. Drag tasks between columns or use the arrow buttons.',
    icon: '📋',
  },
  {
    title: 'Edit and manage tasks',
    description:
      'Use the pencil button to edit a task and the X button to delete one. Search tasks or filter them by priority.',
    icon: '⚙️',
  },
  {
    title: 'Track overdue tasks',
    description:
      'Scroll below the three task columns to find Overdue Tasks. A task is overdue when its due date is before today and it is not marked Done.',
    icon: '⏰',
  },
];

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const last = step === steps.length - 1;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.78)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box',
      background: '#ffffff',
      color: '#172033',
      border: '2px solid #93c5fd',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
      fontFamily: 'Arial, sans-serif',
    },
    button: {
      padding: '11px 18px',
      borderRadius: '9px',
      border: '2px solid #cbd5e1',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 700,
    },
    secondary: {
      background: '#ffffff',
      color: '#1e293b',
      borderColor: '#94a3b8',
    },
    primary: {
      background: '#2563eb',
      color: '#ffffff',
      borderColor: '#2563eb',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      style={styles.overlay}
    >
      <div style={styles.card}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <span
            style={{
              color: '#1d4ed8',
              background: '#dbeafe',
              borderRadius: '999px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            TASKFLOW GUIDE
          </span>

          <button
            type="button"
            onClick={onFinish}
            aria-label="Close onboarding guide"
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '5px',
            marginBottom: '26px',
          }}
          aria-label={`Step ${step + 1} of ${steps.length}`}
        >
          {steps.map((item, index) => (
            <div
              key={item.title}
              style={{
                flex: 1,
                height: '7px',
                borderRadius: '99px',
                background:
                  index <= step ? '#2563eb' : '#dbe4f0',
              }}
            />
          ))}
        </div>

        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '18px',
            background: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            marginBottom: '20px',
          }}
          aria-hidden="true"
        >
          {current.icon}
        </div>

        <p
          style={{
            margin: '0 0 8px',
            color: '#2563eb',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Step {step + 1} of {steps.length}
        </p>

        <h2
          id="onboarding-title"
          style={{
            margin: '0 0 14px',
            color: '#0f172a',
            fontSize: '28px',
            lineHeight: 1.25,
            fontWeight: 800,
          }}
        >
          {current.title}
        </h2>

        <p
          style={{
            margin: '0 0 30px',
            color: '#475569',
            fontSize: '16px',
            lineHeight: 1.8,
          }}
        >
          {current.description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
          }}
        >
          <button
            type="button"
            onClick={onFinish}
            style={{
              ...styles.button,
              ...styles.secondary,
            }}
          >
            Skip guide
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                style={{
                  ...styles.button,
                  ...styles.secondary,
                }}
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                last ? onFinish() : setStep((s) => s + 1)
              }
              style={{
                ...styles.button,
                ...styles.primary,
              }}
            >
              {last ? 'Get started ✓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
