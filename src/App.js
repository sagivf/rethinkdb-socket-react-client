import React, { Component } from 'react';
import logo from './logo.svg';
import io from 'socket.io-client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton'
import './App.css';
import Board from './Board'
import { MenuItem, SelectField, TextField } from 'material-ui'

const socket = io('http://localhost:4000');

function fetchResetEdit() {
  return {type: 'device', left: 0, top: 0, score: 1};
}

class App extends Component {
  state = {
    edit: fetchResetEdit(),
    components: [],
    topUnitComponents: []
  };

  constructor(props) {
    super(props);

    this.updateComponent = this.updateComponent.bind(this);

    socket.on('connect', () => {
      socket.on('init-components', (components) => {
        this.setState({
          components: components
        });
      });
      socket.on('create-components', (component) => {
        this.setState(({components}) => ({
          components: [component, ...components]
        }));
      });
      socket.on('set-top-components', (components) => {
        console.log('pppppp')
        this.setState({
          topUnitComponents: components
        });
      });
      socket.on('change-components', (component) => {
        this.setState(({components}) => {
          Object.assign(components.find(({id}) => id === component.id), component)
          return {components}
        });
      });
    });
  }

  updateComponent(id, left, top) {
    this.setState(({components}) => {
      Object.assign(components.find(({id: _id}) => _id === id), {left, top})
      return {components}
    });
    socket.emit('change-component', {id, left, top});
  }

  updateEdit(update) {
    this.setState(({edit}) => ({
      edit: Object.assign(edit, update)
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('create-components', [this.state.edit])
    this.setState({
      edit: fetchResetEdit()
    })
  }

  render() {
    const {
      components,
      topUnitComponents
    } = this.state;

    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <img src={'https://rethinkdb.com/assets/images/docs/api_illustrations/data_exploration.png'} style={{height: '80px'}} alt="logo" />
            <h1 className="App-title">Welcome to RethinkDB</h1>
          </header>
          <div className="main">
            <form onSubmit={e => this.handleSubmit(e)}>
              <SelectField
                value={this.state.edit.type}
                onChange={(event, index, value) => this.updateEdit({type: value})}>
                <MenuItem value={'device'}  primaryText="Device" />
                <MenuItem value={'application'}  primaryText="Application" />
                <MenuItem value={'cloud'}  primaryText="Cloud" />
                <MenuItem value={'venue'}  primaryText="Venue" />
                <MenuItem value={'gateway'}  primaryText="Gateway" />
              </SelectField><br/>
              <TextField placeholder="type"
                     type="number"
                       name="score"
                     value={this.state.edit.score}
                     onChange={e => this.updateEdit({score: parseInt(e.target.value, 10)})} /><br/>
              <RaisedButton type="submit">Add</RaisedButton>
            </form>
            <div className="top-components">
              <h1>Top 3 score</h1>
              {
                topUnitComponents.map(({id, score}) =>
                  <div key={id} className="component-box">{score}</div>)
              }
            </div>
            <div className="board">
              <h1>Drag and drop</h1>
              <Board boxes={components}
                     components={components}
                     updateComponent={this.updateComponent}/>
            </div>

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
