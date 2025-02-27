import React, { useState } from 'react';

const TodoItem = ({ todo, toggleComplete, editTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo?.text || "");

  const handleEdit = () => {
    if (newText.trim() === "") return;
    editTodo(todo.id, newText);
    setIsEditing(false);
  };

  return (
    <li 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px', 
        borderBottom: '1px solid #ddd',
        textDecoration: todo.completed ? 'line-through' : 'none', // ✅ Apply strikethrough
        color: todo.completed ? 'gray' : 'black', 
      }}
    >
      {isEditing ? (
        <div style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="text" 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)} 
          />
          <button onClick={handleEdit}>Save</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
          <span 
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => toggleComplete(todo.id)} // ✅ Clicking also toggles completion
          >
            {todo.text}
          </span>
          
          <button 
            onClick={() => toggleComplete(todo.id)}
            style={{ 
              background: todo.completed ? "#4CAF50" : "#ddd", 
              color: todo.completed ? "white" : "black", 
              border: "none", 
              padding: "5px 10px", 
              borderRadius: "5px",
              cursor: 'pointer'
            }}
          >
            {todo.completed ? "Completed" : "Complete"}
          </button>

          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
