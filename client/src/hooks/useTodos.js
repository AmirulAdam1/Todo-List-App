import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/todos', { params: filters });
      setTodos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (payload) => {
    const { data } = await api.post('/todos', payload);
    setTodos((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateTodo = useCallback(async (id, payload) => {
    const { data } = await api.patch(`/todos/${id}`, payload);
    setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
    return data;
  }, []);

  const deleteTodo = useCallback(async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const deleteCompleted = useCallback(async () => {
    await api.delete('/todos/completed');
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo, deleteCompleted };
};