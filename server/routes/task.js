// routes/tasks.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const mongoose = require('mongoose');

// Import the User model
const User = require('../models/User');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user; // Authenticated user from auth middleware
    res.json(user.tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Add a new task for the authenticated user
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ msg: 'Task name is required.' });
    }

    // Check for duplicate task names (optional)
    const existingTask = user.tasks.find(
      (task) => task.name.toLowerCase() === name.toLowerCase()
    );
    if (existingTask) {
      return res.status(400).json({ msg: 'Task with this name already exists.' });
    }

    // Create a new task object
    const newTask = {
      name: name.trim(),
      completed: false, // Default to not completed
    };

    // Push the new task to the user's tasks array
    user.tasks.push(newTask);
    await user.save();

    // Return the newly added task
    const addedTask = user.tasks[user.tasks.length - 1];
    res.status(201).json(addedTask);
  } catch (err) {
    console.error('Error adding task:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PATCH /api/tasks/:taskId
 * @desc    Update a task's completion status
 * @access  Private
 */
router.patch('/:taskId', auth, async (req, res) => {
  try {
    const user = req.user;
    const { taskId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ msg: 'Completed status must be a boolean.' });
    }

    // Find the task by ID
    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found.' });
    }

    // Update the completion status
    task.completed = completed;
    await user.save();

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE /api/tasks/:taskId
 * @desc    Remove a task for the authenticated user
 * @access  Private
 */
router.delete('/:taskId', auth, async (req, res) => {
  try {
    // Find the task by ID
    const user = req.user;
    const { taskId } = req.params;
    const task = user.tasks.find(task => task._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found.' });
    }
  
    // Remove the task from the tasks array
    await user.tasks.pull(taskId);
    await user.save();
  
    res.json({ msg: 'Task removed successfully.' });
  } catch (err) {
    console.error('Error removing task:', err.message,err.stack);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
