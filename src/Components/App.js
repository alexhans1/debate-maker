import React, { Component } from 'react';
import Main from "./Main/Main";
import Event from "./Event";
import Navbar from './layout/Navbar/Navbar';
import { Switch, Route,  } from 'react-router-dom';

class App extends Component {

  constructor() {
    super();
    if (!localStorage.getItem('canEdit')) {
      // initialize with the two example events
      localStorage.setItem('canEdit', JSON.stringify([51,61]));
    }
  }

  render() {
    return (
      <div>
        <Navbar />

        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/event/:id' component={Event} />

          <Route path='/' component={Main} />
        </Switch>
      </div>
    );
  }

}

export default App;
