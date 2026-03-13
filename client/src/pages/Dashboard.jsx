import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

const FILTERS = ['all', 'active', 'completed'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo, deleteCompleted } = useTodos();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const params = {};
    if (statusFilter === 'active') params.completed = false;
    if (statusFilter === 'completed') params.completed = true;
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    params.sortBy = sortBy;
    fetchTodos(params);
  }, [statusFilter, priorityFilter, sortBy, fetchTodos]);

  const handleCreate = async (payload) => {
    await createTodo(payload);
    setShowForm(false);
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>My Todos</h1>
          <p className="dashboard__sub">Hello, {user?.name}</p>
        </div>
        <button className="btn-secondary" onClick={logout}>Sign out</button>
      </header>

      <div className="dashboard__controls">
        <div className="filter-group">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="filter-group">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              className={`filter-btn ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="createdAt">Newest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {showForm ? (
        <div className="form-wrapper">
          <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      ) : (
        <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Todo</button>
      )}

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="status-msg">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="status-msg">No todos found.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}

      <footer className="dashboard__footer">
        <span>{remaining} item{remaining !== 1 ? 's' : ''} left</span>
        {todos.some((t) => t.completed) && (
          <button className="btn-text" onClick={deleteCompleted}>Clear completed</button>
        )}
      </footer>
    </div>
  );
};

export default Dashboard;