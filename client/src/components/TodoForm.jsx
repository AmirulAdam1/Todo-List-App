import { useState } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

const TodoForm = ({ onSubmit, initial = {}, onCancel }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    priority: initial.priority || 'medium',
    dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '',
    tagInput: '',
    tags: initial.tags || [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = form.tagInput.trim().toLowerCase();
      if (tag && !form.tags.includes(tag)) {
        setForm({ ...form, tags: [...form.tags, tag], tagInput: '' });
      }
    }
  };

  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags,
    });
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__title"
        type="text"
        name="title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={handleChange}
        required
        autoFocus
      />
      <div className="todo-form__row">
        <select name="priority" value={form.priority} onChange={handleChange}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
      </div>
      <div className="todo-form__tags">
        <div className="tags-list">
          {form.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          name="tagInput"
          placeholder="Add tag (Enter or comma)"
          value={form.tagInput}
          onChange={handleChange}
          onKeyDown={addTag}
        />
      </div>
      <div className="todo-form__actions">
        <button type="submit" className="btn-primary">
          {initial.title ? 'Save Changes' : 'Add Todo'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;