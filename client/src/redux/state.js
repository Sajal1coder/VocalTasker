// redux/store.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  tasks: [],  // Add tasks to initial state
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.tasks = [];  
    },
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks; 
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload.task);  
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload.taskId);
      if (index !== -1) {
        state.tasks[index].completed = action.payload.completed;  
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId);
    }
  }
});

export const { setLogin, setLogout, setTasks, addTask, updateTask, removeTask } = userSlice.actions;
export default userSlice.reducer;
