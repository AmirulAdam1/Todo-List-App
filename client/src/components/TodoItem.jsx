import { useState } from 'react';
import TodoForm from './TodoForm';

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const overdue = d < now;
  return {
    label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    overdue,
  };
};

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const due = formatDate(todo.dueDate);

  const handleToggle = () => onUpdate(todo._id, { completed: !todo.completed });

  const handleEdit = (payload) => {
    onUpdate(todo._id, payload);
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="todo-item todo-item--editing">
        <TodoForm initial={todo} onSubmit={handleEdit} onCancel={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <button
        className={`todo-item__check ${todo.completed ? 'checked' : ''}`}
        onClick={handleToggle}
        aria-label="Toggle complete"
      >
        {todo.completed && '✓'}
      </button>

      <div className="todo-item__body">
        <span className="todo-item__title">{todo.title}</span>
        <div className="todo-item__meta">
          <span
            className="todo-item__priority"
            style={{ color: PRIORITY_COLORS[todo.priority] }}
          >
            {todo.priority}
          </span>
          {due && (
            <span className={`todo-item__due ${due.overdue && !todo.completed ? 'overdue' : ''}`}>
              {due.label}
            </span>
          )}
          {todo.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="todo-item__actions">
        <button onClick={() => setEditing(true)} aria-label="Edit">✏️</button>
        <button onClick={() => onDelete(todo._id)} aria-label="Delete">🗑</button>
      </div>
    </li>
  );
};

export default TodoItem;