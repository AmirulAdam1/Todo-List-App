const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo, deleteCompleted } = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/:id', updateTodo);
router.delete('/completed', deleteCompleted);
router.delete('/:id', deleteTodo);

module.exports = router;