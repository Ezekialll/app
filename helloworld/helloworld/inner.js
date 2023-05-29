const toDoItems = [
    {
      name: 'Нажмите "Создать", чтобы создать новую задачу',
      completed: false
    },
    {
      name: 'Нажмите "Ed", чтобы отредактировать задачу',
      completetd: false
    },
    {
      name: '"Нажмите "Del", чтобы удалить задачу',
      completed: false
    },
    {
      name: "Нажмите на задачу, чтобы отметить ее как завершенную",
      completed: false
    }
  ];
  
  class CreateItem extends React.Component {
    handleCreate(e) {
      e.preventDefault();
      
      if (!this.refs.newItemInput.value) {
        alert(' введите название задачи.');
        return;
      } else if (this.props.toDoItems.map(element => element.name).indexOf(this.refs.newItemInput.value) != -1) {
        alert('Эта задача уже существует.');
        this.refs.newItemInput.value = '';
        return;
      }
      
      this.props.createItem(this.refs.newItemInput.value);
      this.refs.newItemInput.value = '';
    }
    
    render() {
      return (
        <div className="create-new">
          <form onSubmit={this.handleCreate.bind(this)}>
            <input type="text" placeholder="Новая задача" ref="newItemInput" />
            <button>Создать</button>
          </form>
        </div>
      );
    }
  }
  
  class ToDoListItem extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        editing: false
      };
    }
    
    renderName() {
      const itemStyle = {
        'text-decoration': this.props.completed ? 'line-through' : 'none',
        cursor: 'pointer'
      };
      
      if(this.state.editing) {
        return (
            <form onSubmit={this.onSaveClick.bind(this)}>
              <input type="text" ref="editInput" defaultValue={this.props.name} />
            </form>
        );
      }
      
      return (
        <span style={itemStyle}
         onClick={this.props.toggleComplete.bind(this, this.props.name)}>{this.props.name}</span>
      );
    }
    
    renderButtons() {
      if (this.state.editing) {
        return (
          <span>
            <button onClick={this.onSaveClick.bind(this)}>Сохранить</button>
            <button onClick={this.onCancelClick.bind(this)}>Назад</button>
          </span>
        );
      }
      
      return (
        <span>
          <button onClick={this.onEditClick.bind(this)}>Ed</button>
          <button onClick={this.props.deleteItem.bind(this, this.props.name)}>Del</button>
        </span>
      );
    }
    
    onEditClick() {
      this.setState({ editing: true });
      saveTodoItems()
    }
    
    onCancelClick() {
      this.setState({ editing: false });
    }
    
    onSaveClick(e) {
      e.preventDefault();
      this.props.saveItem(this.props.name, this.refs.editInput.value);
      this.setState({ editing: false });
    }
    
    render() {
      return (
        <div className="to-do-item">
          <span className="name">
          {this.renderName()}
          </span>
          <span className="actions">
          {this.renderButtons()}
          </span>
        </div>
      );
    }

    saveTodoItems() {
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
      }
    
      loadTodoItems() {
        this.setState({ todoItems: JSON.parse(localStorage.getItem('todoItems')) });
      }
  }

  if (localStorage.getItem('todoItems')) {
    todoItems = JSON.parse(localStorage.getItem('todoItems'));
  }
  
  class ToDoList extends React.Component {
    renderItems() {
      return this.props.toDoItems.map((item, index) => <ToDoListItem key={index} {...item} {...this.props} />);
    }
    
    render() {
      return (
        <div className="items-list">
          {this.renderItems()}
        </div>
      );
    }
  }
  
  class App extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        toDoItems
      };
    }
    
    createItem(item) {
      this.state.toDoItems.unshift({
        name: item,
        completed: false
      });
      this.setState({
        toDoItems: this.state.toDoItems
      });
    }
    
    findItem(item) {
      return this.state.toDoItems.filter((element) => element.name === item)[0];
    }
    
    toggleComplete(item) {
      let selectedItem = this.findItem(item);
      selectedItem.completed = !selectedItem.completed;
      this.setState({ toDoItems: this.state.toDoItems });
    }
    
    saveItem(oldItem, newItem) {
      let selectedItem = this.findItem(oldItem);
      selectedItem.name = newItem;
      this.setState({ toDoItems: this.state.toDoItems });
    }
    
    deleteItem(item) {
      let index = this.state.toDoItems.map(element => element.name).indexOf(item);
      this.state.toDoItems.splice(index, 1);
      this.setState({ toDoItems: this.state.toDoItems });
    }
    
    render() {
      return (
        <div className="to-do-app">
          <div className="header">
            <h1>T o D o List</h1>
          </div>
          <CreateItem toDoItems={this.state.toDoItems} createItem={this.createItem.bind(this)} />
          <ToDoList toDoItems={this.state.toDoItems} deleteItem={this.deleteItem.bind(this)} saveItem={this.saveItem.bind(this)} toggleComplete={this.toggleComplete.bind(this)} />
        </div>
      );
    }
  }

  
  
  ReactDOM.render(<App />, document.getElementById('app'));