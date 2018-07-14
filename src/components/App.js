import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from 'containers/MainContainer';
import MapContainer from 'containers/MapContainer';
import RestaurantInfo from './RestaurantInfo';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='app-template'>
        <div>
          <Route exact path="/" component={MainContainer} />
          <Switch>
            <Route path="/map/:keyword" component={MapContainer} />
            <Route path="/map" component={MapContainer} />
          </Switch>
          <Route path="/restaurant/:id" component={RestaurantInfo} />
        </div>
      </div>
    );
  }
}

export default App;
