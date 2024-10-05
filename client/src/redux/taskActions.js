// redux/taskActions.js
import { setTasks, addTask, updateTask, removeTask } from './state'; // Adjust the path if necessary
import { toast } from 'react-toastify'; // Optional: For notifications

// Base URL for your API
const API_URL = 'http://localhost:8001/api/tasks';

// Fetch tasks from the backend
export const fetchTasks = () => async (dispatch, getState) => {
  try {
    const token  = getState().token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(API_URL, config);
    if (!response.ok) throw new Error('Error fetching tasks');
    
    const tasks = await response.json();
    dispatch(setTasks({ tasks }));
    toast.success('Tasks fetched successfully!');
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    toast.error(error.message || 'Error fetching tasks');
  }
};

// Add a new task to the backend
export const addNewTask = (taskName) => async (dispatch, getState) => {
  if (!taskName || taskName.trim() === '') {
    toast.error('Task name cannot be empty!');
    return;
  }

  try {
    const token = getState().token;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: taskName }),
    };

    const response = await fetch(API_URL, config);
    if (!response.ok) throw new Error('Error adding task');

    const newTask = await response.json();
    dispatch(addTask({ task: newTask }));
    toast.success('Task added successfully!');
  } catch (error) {
    console.error('Error adding task:', error.message);
    toast.error(error.message || 'Error adding task');
  }
};

// Update a task's completion status in the backend
export const updateTaskStatus = (taskId, completed) => async (dispatch, getState) => {
  try {
    const token = getState().token;
    const config = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    };

    const response = await fetch(`${API_URL}/${taskId}`, config);
    if (!response.ok) throw new Error('Error updating task');

    const updatedTask = await response.json();
    dispatch(updateTask({ taskId, completed: updatedTask.completed }));
    toast.success('Task updated successfully!');
  } catch (error) {
    console.error('Error updating task:', error.message);
    toast.error(error.message || 'Error updating task');
  }
};

// Remove a task from the backend
export const removeTaskAction = (taskId) => async (dispatch, getState) => {
  try {
    const  token  = getState().token;
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${API_URL}/${taskId}`, config);
    if (!response.ok) throw new Error('Error removing task');

    dispatch(removeTask({ taskId }));
    toast.success('Task removed successfully!');
  } catch (error) {
    console.error('Error removing task:', error.message);
    console.log('Task ID:', taskId);
    toast.error(error.message || 'Error removing task');
  }
};
