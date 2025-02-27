import React, { useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import TodoItem from './TodoItem';

const TodoList = ({ todos, toggleComplete, editTodo, deleteTodo }) => {
  const nodeRefs = useRef({});

  return (
    <TransitionGroup component="ul"> {/* Ensure it's a list */}
      {todos
        .filter(todo => todo) // Prevent undefined values
        .map((todo, index) => {
          const key = todo.id || index; // ✅ Ensure unique key

          if (!nodeRefs.current[key]) {
            nodeRefs.current[key] = React.createRef();
          }

          return (
            <CSSTransition key={key} nodeRef={nodeRefs.current[key]} timeout={500} classNames="fade">
              <li ref={nodeRefs.current[key]}>
                <TodoItem 
                  todo={todo} 
                  index={index}  // ✅ Consistent index usage
                  toggleComplete={toggleComplete} 
                  editTodo={editTodo} 
                  deleteTodo={deleteTodo} 
                />
              </li>
            </CSSTransition>
          );
        })}
    </TransitionGroup>
  );
};

export default TodoList;
