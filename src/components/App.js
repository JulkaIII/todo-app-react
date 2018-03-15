/* eslint-disable import/no-named-as-default */
import React from "react";
import PropTypes from "prop-types";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import swal from "sweetalert";

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: []
    };
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    let self = this;
    let listItems = [];
    let getUrl =
      "https://api.backendless.com/DCEDF76D-9662-324E-FF07-3C8BF4BBE100/F1870599-8446-F184-FFF4-DB8A4B81F800/services/TodoItemsService/todo-items";
    fetch(getUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response.statusText);
        }
      })
      .then(json => {
        listItems = json;
        self.setState({
          listItems: listItems
        });
      })
      .catch(error => swal("Something went wrong...", error, "error"));
  }

  removeItem(id) {
    let deleteUrl =
      "https://api.backendless.com/DCEDF76D-9662-324E-FF07-3C8BF4BBE100/F1870599-8446-F184-FFF4-DB8A4B81F800/services/TodoItemsService/todo-items";
    let self = this;

    fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: id
    }).then(response => {
      if (response.ok) {
        let newListItems = self.state.listItems.filter(item => {
          if (item.objectId !== id) {
            return item;
          }
        });
        self.setState({
          listItems: newListItems
        });
      } else {
        swal("Something went wrong...", response.statusText, "error");
      }
    });
  }

  addItem(formData) {
    let postUrl =
      "https://api.backendless.com/DCEDF76D-9662-324E-FF07-3C8BF4BBE100/F1870599-8446-F184-FFF4-DB8A4B81F800/services/TodoItemsService/list-items";

    let self = this;

    fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: formData.todoText
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response.statusText);
        }
      })
      .then(json => {
        let newListItems = self.state.listItems;
        newListItems.unshift(json);
        self.setState({
          listItems: newListItems
        });
      })
      .catch(error => swal("Something went wrong...", error, "error"));
  }

  updateItem(id) {
    let body = {};
    let newListItems = this.state.listItems;
    newListItems.map(item => {
      if (item.objectId === id) {
        body = {
          objectId: id,
          text: item.text,
          checked: !item.checked
        };
      }
    });

    let putUrl =
      "https://api.backendless.com/DCEDF76D-9662-324E-FF07-3C8BF4BBE100/F1870599-8446-F184-FFF4-DB8A4B81F800/services/TodoItemsService/todo-items";
    let self = this;

    fetch(putUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response.statusText);
        }
      })
      .then(json => {
        newListItems.map(item => {
          if (item.objectId === id) {
            item.checked = json.checked;
          }
        });
        self.setState({
          listItems: newListItems
        });
      })
      .catch(error => swal("Something went wrong...", error, "error"));
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div className="header">
            <img src="images/plan.png" />
          </div>
          <Paper className="paper">
            <AddTodo addItem={this.addItem} />
            <TodoList
              listItems={this.state.listItems}
              removeItem={this.removeItem}
              updateItem={this.updateItem}
            />
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  removeItem: PropTypes.func,
  addItem: PropTypes.func,
  updateItem: PropTypes.func,
  listItems: PropTypes.array
};

export default App;
