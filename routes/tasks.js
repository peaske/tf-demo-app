const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { requestLogger, validateTask, validateId } = require('../middleware/validation');

// すべてのルートにログミドルウェアを適用
router.use(requestLogger);

// すべてのタスクを取得 GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error.message
    });
  }
});

// 特定のタスクを取得 GET /api/tasks/:id
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
      message: error.message
    });
  }
});

// 新しいタスクを作成 POST /api/tasks
router.post('/', validateTask, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    
    const newTask = await db.createTask({ title, description, priority });
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      message: error.message
    });
  }
});

// タスクを更新 PUT /api/tasks/:id
router.put('/:id', validateId, validateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    
    // タスクが存在するかチェック
    const existingTask = await db.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    const updatedTask = await db.updateTask(id, {
      title: title || existingTask.title,
      description: description || existingTask.description,
      status: status || existingTask.status,
      priority: priority || existingTask.priority
    });
    
    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
      message: error.message
    });
  }
});

// タスクを削除 DELETE /api/tasks/:id
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    // タスクが存在するかチェック
    const existingTask = await db.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    await db.deleteTask(id);
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      message: error.message
    });
  }
});

module.exports = router;