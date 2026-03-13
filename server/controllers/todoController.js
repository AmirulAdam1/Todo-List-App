const Todo = require('../models/Todo');

const getTodos = async (req, res) => {
  try {
    const { completed, priority, tag, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = { user: req.user._id };

    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (tag) filter.tags = tag;

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    const todos = await Todo.find(filter).sort(sort);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, priority, dueDate, tags } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = await Todo.create({
      user: req.user._id,
      title,
      priority,
      dueDate: dueDate || null,
      tags: tags || [],
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const { title, completed, priority, dueDate, tags } = req.body;

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (tags !== undefined) todo.tags = tags;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCompleted = async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.user._id, completed: true });
    res.json({ message: 'Completed todos deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, deleteCompleted };