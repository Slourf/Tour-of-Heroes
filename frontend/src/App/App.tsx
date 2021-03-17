import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import NavBar from "../NavBar/NavBar"
import AddHeroForm from "../AddHeroForm/AddHeroForm"
import Heroes from "../Heroes/Heroes"
import PageBody from "../PageBody/PageBody"
import HeroDetail from "../HeroDetail/HeroDetail"

import './App.css';

export default class App extends React.PureComponent {

  fetchHeroes = () => {
    
  }

  render() {
    return (
      <Router>
        <NavBar/>

        <PageBody>
          <Switch>
            <Route exact path="/">
              <Heroes />
            </Route>
            <Route path="/dashboard">

            </Route>
            <Route exact path="/heroes">
              <Heroes />
            </Route>
            <Route exact path="/heroes/:id" component={HeroDetail} />
            <Route exact path="/heroes/add">
              <AddHeroForm  />
            </Route>
          </Switch>
        </PageBody>
      </Router>
    );
  }
}