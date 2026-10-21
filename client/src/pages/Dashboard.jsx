
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Onboarding from '../components/Onboarding.jsx';

const COLS = [
  ['todo', 'To do'],
  ['doing', 'In progress'],
  ['done', 'Done'],
];

const fmt = (value) => {
  if (!value) return '';

  // Display date-only values without timezone shifting.
  const datePart = String(value).slice(0, 10);
  const parts = datePart.split('-').map(Number);

  if (
    parts.length === 3 &&
    parts.every(Number.isFinite) &&
    parts[0] > 0 &&
    parts[1] >= 1 &&
    parts[1] <= 12 &&
    parts[2] >= 1 &&
    parts[2] <= 31
  ) {
    return new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    ).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
};

const getDateOnly = (value) => {
  const datePart = String(value).slice(0, 10);
  const parts = datePart.split('-').map(Number);

  if (
    parts.length === 3 &&
    parts.every(Number.isFinite) &&
    parts[0] > 0 &&
    parts[1] >= 1 &&
    parts[1] <= 12 &&
    parts[2] >= 1 &&
    parts[2] <= 31
  ) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  date.setHours(0, 0, 0, 0);
  return date;
};

export default function Dashboard({ user, logout }) {
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState('');
  const [pri, setPri] = useState('all');

  const [form, setForm] = useState({
    title: '',
    priority: 'medium',
    due: '',
  });

  const [err, setErr] = useState('');
  const [over, setOver] = useState('');
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem('tf_onboarding_done') !== 'true'
  );

  useEffect(() => {
    const esc = (event) => {
      if (event.key === 'Escape') setEdit(null);
    };

    window.addEventListener('keydown', esc);

    return () => window.removeEventListener('keydown', esc);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      setLoading(true);

      try {
        const result = await api('/tasks');

        if (!active) return;

        const list = Array.isArray(result)
          ? result
          : result?.tasks;

        setTasks(Array.isArray(list) ? list : []);
        setErr('');
      } catch (error) {
        if (active) {
          setErr(error.message || 'Could not load tasks.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const add = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setErr('Please enter a task title.');
      return;
    }

    setSaving(true);
    setErr('');

    try {
      const result = await api('/tasks', {
        method: 'POST',
        body: {
          ...form,
          title: form.title.trim(),
          due: form.due || null,
        },
      });

      const task = result?.task || result;

      if (!task?._id) {
        throw new Error('The server did not return the created task.');
      }

      setTasks((current) => [task, ...current]);

      setForm({
        title: '',
        priority: 'medium',
        due: '',
      });
    } catch (error) {
      setErr(error.message || 'Could not create the task.');
    } finally {
      setSaving(false);
    }
  };

  const move = async (id, status) => {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((task) =>
        task._id === id ? { ...task, status } : task
      )
    );

    try {
      const result = await api('/tasks/' + id, {
        method: 'PUT',
        body: { status },
      });

      const updatedTask = result?.task || result;

      if (updatedTask?._id) {
        setTasks((current) =>
          current.map((task) =>
            task._id === id
              ? { ...task, ...updatedTask }
              : task
          )
        );
      }

      setErr('');
    } catch (error) {
      setTasks(previousTasks);
      setErr(error.message || 'Could not update task status.');
    }
  };

  const del = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const previousTasks = tasks;

    setTasks((current) =>
      current.filter((task) => task._id !== id)
    );

    try {
      await api('/tasks/' + id, {
        method: 'DELETE',
      });

      setErr('');
    } catch (error) {
      setTasks(previousTasks);
      setErr(error.message || 'Could not delete the task.');
    }
  };

  const openEdit = (task) =>
    setEdit({
      ...task,
      description: task.description || '',
      tags: (task.tags || []).join(', '),
      due: task.due ? String(task.due).slice(0, 10) : '',
    });

  const save = async (event) => {
    event.preventDefault();

    if (!edit?.title?.trim()) {
      setErr('Please enter a task title.');
      return;
    }

    const { _id, title, description, priority, due, tags } = edit;

    setSaving(true);
    setErr('');

    try {
      const result = await api('/tasks/' + _id, {
        method: 'PUT',
        body: {
          title: title.trim(),
          description,
          priority,
          due: due || null,
          tags: tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 6),
        },
      });

      const updatedTask = result?.task || result;

      setTasks((current) =>
        current.map((task) =>
          task._id === _id
            ? {
                ...task,
                ...edit,
                ...updatedTask,
                tags:
                  updatedTask?.tags ||
                  tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .slice(0, 6),
              }
            : task
        )
      );

      setEdit(null);
    } catch (error) {
      setErr(error.message || 'Could not save task changes.');
    } finally {
      setSaving(false);
    }
  };

  const shown = useMemo(
    () =>
      tasks.filter((task) => {
        const searchableText = [
          task.title || '',
          task.description || '',
          ...(task.tags || []),
        ]
          .join(' ')
          .toLowerCase();

        return (
          searchableText.includes(q.toLowerCase()) &&
          (pri === 'all' || (task.priority || 'medium') === pri)
        );
      }),
    [tasks, q, pri]
  );

  const today = getDateOnly(new Date());

  const total = tasks.length;
  const done = tasks.filter((task) => task.status === 'done').length;
  const doing = tasks.filter((task) => task.status === 'doing').length;
  const todo = tasks.filter(
    (task) => !task.status || task.status === 'todo'
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.due || task.status === 'done') return false;

    const dueDate = getDateOnly(task.due);

    return dueDate !== null && today !== null && dueDate < today;
  });

  const pct = total ? Math.round((done / total) * 100) : 0;

  const finishOnboarding = () => {
    localStorage.setItem('tf_onboarding_done', 'true');
    setShowOnboarding(false);
  };

  const reopenOnboarding = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="app">
      <header className="nav">
        <span className="logo">TaskFlow</span>

        <nav>
          <button
            type="button"
            className="btn"
            onClick={reopenOnboarding}
          >
            ❓ Help / Show Guide
          </button>

          <ThemeToggle />

          <span className="muted">
            Hi, {user?.name?.split(' ')[0] || 'there'}
          </span>

          <button
            type="button"
            className="btn"
            onClick={logout}
          >
            Log out
          </button>
        </nav>
      </header>

      {err && (
        <div className="error" role="alert">
          {err}

          <button
            type="button"
            className="btn"
            onClick={() => setErr('')}
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="summary">
        <div>
          <strong>{pct}%</strong> complete
          <span className="muted">
            {' '}· {done} of {total} tasks done
          </span>
        </div>

        <div
          className="bar"
          role="progressbar"
          aria-label="Task completion"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <i style={{ width: pct + '%' }} />
        </div>

        <div className="muted">
          {todo} to do · {doing} in progress · {overdueTasks.length} overdue
        </div>
      </section>

      <form className="toolbar" onSubmit={add}>
        <input
          className="grow"
          placeholder="Add a task and press Enter"
          value={form.title}
          onChange={(event) =>
            setForm({ ...form, title: event.target.value })
          }
          maxLength={140}
          aria-label="Task title"
        />

        <select
          value={form.priority}
          onChange={(event) =>
            setForm({ ...form, priority: event.target.value })
          }
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={form.due}
          onChange={(event) =>
            setForm({ ...form, due: event.target.value })
          }
          aria-label="Due date"
        />

        <button
          type="submit"
          className="btn primary"
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add task'}
        </button>
      </form>

      <div className="toolbar">
        <input
          className="grow"
          placeholder="Search tasks"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          aria-label="Search tasks"
        />

        <select
          value={pri}
          onChange={(event) => setPri(event.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Task board */}
      {loading ? (
        <p className="empty">Loading your tasks...</p>
      ) : (
        <div className="board">
          {COLS.map(([key, name], index) => {
            const list = shown.filter(
              (task) => (task.status || 'todo') === key
            );

            return (
              <section
                key={key}
                className={'col' + (over === key ? ' over' : '')}
                onDragOver={(event) => {
                  event.preventDefault();
                  setOver(key);
                }}
                onDragLeave={() => setOver('')}
                onDrop={(event) => {
                  event.preventDefault();
                  setOver('');

                  const id = event.dataTransfer.getData('id');

                  if (id) {
                    const task = tasks.find((item) => item._id === id);

                    if (task && task.status !== key) {
                      move(id, key);
                    }
                  }
                }}
              >
                <h3>
                  {name} <span>{list.length}</span>
                </h3>

                {list.length === 0 && (
                  <p className="empty">
                    {key === 'todo'
                      ? 'Nothing waiting. Add a task above.'
                      : 'Drag a task here.'}
                  </p>
                )}

                {list.map((task) => {
                  const taskDue = task.due
                    ? getDateOnly(task.due)
                    : null;

                  const overdue =
                    taskDue !== null &&
                    today !== null &&
                    task.status !== 'done' &&
                    taskDue < today;

                  return (
                    <article
                      key={task._id}
                      draggable
                      onDragStart={(event) =>
                        event.dataTransfer.setData('id', task._id)
                      }
                      className={
                        'card p-' +
                        (task.priority || 'medium') +
                        (key === 'done' ? ' done' : '')
                      }
                    >
                      <p className="title">{task.title}</p>

                      {task.description && (
                        <p className="desc">{task.description}</p>
                      )}

                      {task.tags?.length > 0 && (
                        <div className="tags">
                          {task.tags.map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              className="chip"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <footer>
                        <span className={'tag' + (overdue ? ' late' : '')}>
                          {overdue
                            ? '⚠ Overdue · ' + fmt(task.due)
                            : task.due
                              ? fmt(task.due)
                              : task.priority || 'medium'}
                        </span>

                        <span className="actions">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                move(task._id, COLS[index - 1][0])
                              }
                              aria-label="Move left"
                            >
                              ‹
                            </button>
                          )}

                          {index < COLS.length - 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                move(task._id, COLS[index + 1][0])
                              }
                              aria-label="Move right"
                            >
                              ›
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openEdit(task)}
                            aria-label="Edit task"
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            onClick={() => del(task._id)}
                            aria-label="Delete task"
                          >
                            ✕
                          </button>
                        </span>
                      </footer>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}

      {/* Overdue tasks below the complete board */}
      <section className="col overdue-section">
        <h3>
          ⏰ Overdue Tasks <span>{overdueTasks.length}</span>
        </h3>

        {overdueTasks.length === 0 ? (
          <p className="empty">
            No overdue tasks. Great job!
          </p>
        ) : (
          overdueTasks.map((task) => (
            <article
              key={task._id}
              className={'card p-' + (task.priority || 'medium')}
            >
              <p className="title">{task.title}</p>

              {task.description && (
                <p className="desc">{task.description}</p>
              )}

              {task.tags?.length > 0 && (
                <div className="tags">
                  {task.tags.map((tag, tagIndex) => (
                    <span
                      key={`${tag}-${tagIndex}`}
                      className="chip"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <footer>
                <span className="tag late">
                  Due: {fmt(task.due)}
                </span>

                <span className="muted">
                  {task.status === 'todo' ? 'To do' : 'In progress'}
                </span>

                <span className="actions">
                  <button
                    type="button"
                    onClick={() => openEdit(task)}
                    aria-label={'Edit ' + task.title}
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    onClick={() => move(task._id, 'done')}
                    aria-label={'Complete ' + task.title}
                  >
                    ✓
                  </button>

                  <button
                    type="button"
                    onClick={() => del(task._id)}
                    aria-label={'Delete ' + task.title}
                  >
                    ✕
                  </button>
                </span>
              </footer>
            </article>
          ))
        )}
      </section>

      {/* Edit task modal */}
      {edit && (
        <div
          className="overlay"
          onClick={() => setEdit(null)}
        >
          <form
            className="modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={save}
            role="dialog"
            aria-modal="true"
            aria-label="Edit task"
          >
            <h2>Edit task</h2>

            <label>
              Title
              <input
                value={edit.title}
                onChange={(event) =>
                  setEdit({ ...edit, title: event.target.value })
                }
                maxLength={140}
                required
                autoFocus
              />
            </label>

            <label>
              Description
              <textarea
                rows={3}
                value={edit.description}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    description: event.target.value,
                  })
                }
                maxLength={500}
              />
            </label>

            <div className="row">
              <label>
                Priority
                <select
                  value={edit.priority || 'medium'}
                  onChange={(event) =>
                    setEdit({
                      ...edit,
                      priority: event.target.value,
                    })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>
                Due date
                <input
                  type="date"
                  value={edit.due}
                  onChange={(event) =>
                    setEdit({ ...edit, due: event.target.value })
                  }
                />
              </label>
            </div>

            <label>
              Tags{' '}
              <span className="muted">
                (comma separated, up to 6)
              </span>

              <input
                value={edit.tags}
                onChange={(event) =>
                  setEdit({ ...edit, tags: event.target.value })
                }
              />
            </label>

            <div className="row end">
              <button
                type="button"
                className="btn"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* First-visit guide and reusable Help button */}
      {showOnboarding && (
        <Onboarding onFinish={finishOnboarding} />
      )}
    </div>
  );
}
