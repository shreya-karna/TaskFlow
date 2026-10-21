import { useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme);
  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('tf_theme', next);
    setTheme(next);
  };
  return (
    <button className="theme" onClick={flip} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
