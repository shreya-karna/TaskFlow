import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';

const COLS = ['To do', 'In progress', 'Done'];
const START = [
  { id: 1, t: 'Send the launch email', p: 'high', c: 0 },
  { id: 2, t: 'Review pull requests', p: 'medium', c: 0 },
  { id: 3, t: 'Book team offsite', p: 'low', c: 1 },
  { id: 4, t: 'Update pricing page', p: 'medium', c: 2 },
];

function DemoBoard() {
  const [cards, setCards] = useState(START);
  const advance = (id) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, c: (c.c + 1) % 3 } : c)));
  return (
    <div className="board demo" aria-label="Interactive demo board">
      {COLS.map((name, i) => (
        <section key={name} className="col">
          <h3>{name} <span>{cards.filter((c) => c.c === i).length}</span></h3>
          {cards.filter((c) => c.c === i).map((c) => (
            <button key={c.id} className={'card p-' + c.p + (i === 2 ? ' done' : '')} onClick={() => advance(c.id)}>
              {c.t}
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}

export default function Landing({ user }) {
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">TaskFlow</Link>
        <nav>
          <a href="#features">Features</a><ThemeToggle />
          {user ? <Link className="btn primary" to="/app">Open board</Link> : <><Link to="/login">Log in</Link><Link className="btn primary" to="/signup">Start free</Link></>}
        </nav>
      </header>

      <section className="hero">
        <h1>Work moves forward when you can see it move.</h1>
        <p>TaskFlow is a calm, fast board for the things you need to finish. Add a task, drag it along, and watch the day clear.</p>
        <div className="cta-row">
          <Link className="btn primary lg" to="/signup">Create a free account</Link>
          <span className="muted">Try it below. Click any card to move it.</span>
        </div>
        <DemoBoard />
      </section>

      <section id="features" className="features">
        <article><h2>Drag, drop, done</h2><p>Move tasks between To do, In progress, and Done. The progress bar updates as you go.</p></article>
        <article><h2>Priorities you can scan</h2><p>High, medium, and low priority each get their own color, so urgent work stands out at a glance.</p></article>
        <article><h2>Due dates that warn you</h2><p>Overdue tasks turn red before they slip. Search and filter to find any task in seconds.</p></article>
        <article><h2>Private by default</h2><p>Your tasks sit behind your own login, secured with hashed passwords and signed sessions.</p></article>
      </section>

      <section className="final">
        <h2>Clear your list today.</h2>
        <Link className="btn primary lg" to="/signup">Start with TaskFlow</Link>
      </section>
      <footer className="foot">Built with MongoDB, Express, React, and Node.</footer>
    </>
  );
}
