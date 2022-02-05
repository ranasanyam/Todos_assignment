import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState([{id:'1', done: false, item: 'todo 1'}]);

  const createTodoHandler = (item) => {
    const todo = {
      done: false,
      id: (Math.random() * 15.75).toFixed(2)
    }
    setTodos([{...todo, item}, ...todos]);
  }

  const completeTodoHandler = (id) => {
    const todoIndex = todos.findIndex((item) => item.id === id);
    const todo = todos;

    todo[todoIndex].done = !todo[todoIndex].done;

    setTodos([...todos]);
  }

  const completeAllTodosHandler = () => {
    const allDone = todos.every((item) => item.done);
    const allNotDone = todos.every((item) => !item.done);

    let completeTodos;

    const mapAllTodos = (bol) => {
      completeTodos = todos.map((item) => { item.done = bol ? !item.done : true; return item;});
    }

    if(allDone || allNotDone) {
      mapAllTodos(true);
    } else {
      mapAllTodos(false);
    }
    setTodos(completeTodos);
  }

  const deleteTodoHandler = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);

    setTodos(newTodos);
  }

  

  const deleteCompleteTodosHandler = () => {
    const completed = todos.filter((item) => !item.done);

    setTodos(completed);
  }

  const notCompletedTodosLength = () => {
    const notCompleted = todos.filter(item => item.done === false);
    return notCompleted.length;
  }
  const completedTodosLength = () => {
    const completed = todos.filter((item) => item.done);
    return completed.length;
  }

  const setNewFilter = (filter) => {
    setFilter(filter);
  }
  const editTodoHandler = (id, todo) => {
    const editTodo = todos.find((td) => td.id === id);
    editTodo.item = todo;
    editTodo.done = false;
  }
  
  
  const getFilteredPredicate = (item) => {
    switch(filter) {
      case 'completed':
        return item.done;
      case 'all':
        return true;
      case 'active':
        return !item.done;
    }
  }

  return (
    <div className="app">
      <div className="appBody">
      <TodoTitle />
     
     <TodoInput 
     filter={setNewFilter}
     create={createTodoHandler}
     completeAll={completeAllTodosHandler}
     />
     
     <TodoList 
     complete={completeTodoHandler}
     todos={todos.filter(getFilteredPredicate)}
     delete={deleteTodoHandler}
     edit={editTodoHandler}
     />

     <Footer 
     todos={todos.length}
     notCompletedLength={notCompletedTodosLength}
     completedLength={completedTodosLength}
     deleteCompleted={deleteCompleteTodosHandler}
     filter={setNewFilter}
     />
      </div>

     
    </div>
  )
}

const Footer = ( props ) => {
  const createFooter = () => {
    if(props.todos > 0) {
      return (
          <div style={{
            display: "flex",
            flexDirection: 'row',
            justifyContent:'space-evenly',
            alignItems: 'center'
          }}>
          <div><span>{props.notCompletedLength() + " items left"}</span></div>
          <div>
          <button className="footerBtn" onClick={() => props.filter('all')}>All</button>
          <button className="footerBtn" onClick={() => props.filter('active')}>Active</button>
          <button className="footerBtn" onClick={() => props.filter('completed')}>Completed</button>
          </div>
          <div>
          {!!props.completedLength() && <button className="footerBtn" onClick={props.deleteCompleted}>Clear completed</button>}
          </div>
        </div>
        
      )
    }
  }
  return (
    <footer style={{ width: '100%'}}>
      {createFooter()}
    </footer>
  )
}

const TodoInput = (props) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if(props.value) {
      setValue(props.value);
    }
  }, [props]);

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const handleSubmit = (e) => {
    if(e.target.value === "") {
      return;
    }
    if(e.key === 'Enter') {
      e.preventDefault();
      props.create(value);
      e.target.value = '';
    }
  }
  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => props.filter('all')} type="button" className="showAllTodosBtn">&#8681;</button>
      <input 
      placeholder="What needs to be done?"
      onKeyPress={handleSubmit}
      onChange={handleChange}
      type="text"
      autoFocus={true}
      className="inputContainer"
      />
    </div>
  )
}
const TodoTitle = () => {
  return (
    <h1 style={{ fontSize: '2rem', color: 'rgba(231, 0, 0, 0.312)'}}>todos</h1>
  )
}

const TodoList = ( props ) => {
  const todoItems = props.todos.map((item) => {
    return <TodoItem 
    key={item.id}
    edit={props.edit}
    todo={item}
    complete={props.complete}
    delete={props.delete}
    />
  });
  return (
    <ul className="todoList">
      {todoItems}
    </ul>
  )
}

const TodoItem = ( props ) => {
  const [editable, setEditable] = useState(false);
  const [todoValue, setTodoValue] = useState('');


  useEffect(() => {
    setEditable(false);
  }, []);
  

  const doubleClickHandler = (todo) => {
    
    
    setEditable(true);
    
    setTodoValue(todo);
  }
  const handleSubmit = (e) => {
    if(e.target.value === "") {
      return;
    }
    if(e.key === 'Enter') {
      e.preventDefault();
      props.edit(props.todo.id, todoValue);
      e.target.value = '';
      setEditable(false);
    }
  }
  const handleChange = (e) => {
    setTodoValue(e.target.value);
  }
  return (
    <li className="todoItem" id={props.todo.id} onClick={() => setEditable(false)}>
      <input 
      type="checkbox"
      onChange={() => props.complete(props.todo.id)}
      checked={props.todo.done}
      />
      {editable ? (
        <input 
        placeholder="What needs to be done?"
        value={todoValue}
        type="text"
        onKeyPress={handleSubmit}
        onChange={handleChange}
        autoFocus={true}
        className="inputContainer"
        />
      ) : (
        
        <span onDoubleClick={() => doubleClickHandler(props.todo.item)} className={props.todo.done ? 'done' : ''} style={{ fontSize: '2rem'}}>{props.todo.item}</span>
      )}
      
      <button className="deleteTodoBtn" onClick={() => props.delete(props.todo.id)}>&times;</button>
    </li>
  )
}
export default App;
