import React, { useState, useEffect } from 'react';
import '../style/voice.css';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicIcon from '@mui/icons-material/Mic';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, addNewTask, updateTaskStatus, removeTaskAction } from '../redux/taskActions'; // Import task actions
import { toast } from 'react-toastify'; // For notifications

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Voice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const tasks = useSelector((state) => state.tasks || []); // Fetch tasks from Redux state
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && token) {
      dispatch(fetchTasks()); // Fetch tasks when component mounts and user is logged in
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    // Handle the result when speech is recognized
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      handleTaskCommand(speechToText);
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Speech recognition error: ' + event.error);
    };

    // Handle the end of speech recognition
    recognition.onend = () => {
      setIsListening(false); // Stop listening once recognition ends
    };

    // Clean up the event listeners on component unmount
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [tasks, user]);

  const handleClick = () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    if (isListening) {
      recognition.stop(); // Stop listening
    } else {
      talkBack('Hello, input your tasks');
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const CommandDetails = () => {
    return (
      <div className="command-details">
        <p>Available commands:</p>
        <ul>
          <li>add task [task name]</li>
          <li>completed task [task name]</li>
          <li>remove task [task name]</li>
        </ul>
      </div>
    );
  };


  const talkBack = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    const voice = window.speechSynthesis.getVoices().find(
      (voice) => voice.name === 'Google US English Female'
    );
    if (voice) {
      utterance.voice = voice;
    }
    window.speechSynthesis.speak(utterance);
  };

  const handleTaskCommand = (speechToText) => {
    const lowerCaseText = speechToText.toLowerCase();

    if (lowerCaseText.includes('add task')) {
      const taskName = lowerCaseText.replace('add task', '').trim();
      if (taskName) {
        // Check for duplicate tasks
        const existingTask = tasks.find(
          (t) => t.name.toLowerCase() === taskName.toLowerCase()
        );
        if (existingTask) {
          toast.warn(`Task "${taskName}" already exists.`);
          talkBack(`Task ${taskName} already exists.`);
        } else {
          dispatch(addNewTask(taskName)); // Dispatch addTask action
          talkBack(`Task ${taskName} added successfully.`);
        }
      }
    } else if (lowerCaseText.includes('completed task')) {
      const taskName = lowerCaseText.replace('completed task', '').trim();
      const task = tasks.find(
        (t) => t.name.toLowerCase() === taskName.toLowerCase()
      );
      if (task) {
        dispatch(updateTaskStatus(task._id, true)); // Dispatch updateTask action to complete the task
        talkBack(`Task ${taskName} completed.`);
      } else {
        toast.error(`Task "${taskName}" not found.`);
        talkBack(`Task ${taskName} not found.`);
      }
    } else if (lowerCaseText.includes('remove task')) {
      const taskName = lowerCaseText.replace('remove task', '').trim();
      const task = tasks.find(
        (t) => t.name.toLowerCase() === taskName.toLowerCase()
      );
      if (task) {
        dispatch(removeTaskAction(task._id)); // Dispatch removeTask action
        talkBack(`Task ${taskName} removed.`);
      } else {
        toast.error(`Task "${taskName}" not found.`);
        talkBack(`Task ${taskName} not found.`);
      }
    }
  };

  const handleCheckboxChange = (taskId, completed) => {
    dispatch(updateTaskStatus(taskId, completed)); // Update task completion status
  };
  const handleButtonClick = () => {
    if (window.innerWidth < 480) {
      alert("Available commands:\nadd task [task name]\ncompleted task [task name]\nremove task [task name]");
      return;
    }
    setIsHovering(true);
  };

  const handleButtonMouseOut = () => {
    setIsHovering(false);
  };
  
  return (
    <>
      <div className='voice'>
        <div className='voice_input'>
          Tap the mic to input Command
          <div className="info-button-container">
          <button
              className="info-button"
              onClick={handleButtonClick}
              onMouseOver={() => handleButtonClick()}
              onMouseOut={handleButtonMouseOut}
            >
                <InfoIcon sx={{color:'#0096FF'}}/> 
            </button>
            {isHovering && window.innerWidth >= 480 && (
              <div className="tooltip">
                <CommandDetails />
              </div>
            )}
          </div>
        </div>
        <div className='voice_button'>
          <button onClick={handleClick}>
            {isListening && user ? (
              <MicIcon sx={{ color: 'red' }} />
            ) : (
              <MicNoneIcon sx={{ color: 'grey' }} />
            )}
          </button>
        </div>
        <div className="transcript">
          <p>{transcript}</p>
        </div>
      </div>
      <div className='task-list'>
        <h3>
          <span>Tasks</span>
          <span>Completed</span>
        </h3>
        {user && token ? (
          tasks.length > 0 ? (
            <ul>
              {tasks.map((task) => (
                <li key={task._id} className='data'>
                  <span className="task-name">{task.name}</span>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheckboxChange(task._id, !task.completed)} // Toggle task completion
                  />
                  <div className='task-actions'>
                    <button className='but' onClick={() => dispatch(removeTaskAction(task._id))}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='no-tasks'>No tasks found</div>
          )
        ) : (
          <div className='no-tasks'>
            To see or add tasks, <button className='login-button' onClick={() => navigate('/login')}>login</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Voice;
