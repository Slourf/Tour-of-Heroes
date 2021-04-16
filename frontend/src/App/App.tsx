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
import Notification from "../Notification/Notification"
import SignIn from "../SignIn/SignIn"

import './App.css';

export default class App extends React.PureComponent {

  fetchHeroes = () => {
    
  }

  render() {
    return (
      <div id="toh-app">
        <Router>
          <NavBar/>
          <Notification />
          <PageBody>
            <Switch>
              <Route exact path="/" component={Heroes} />
              <Route exact path="/heroes" component={Heroes} />
              <Route exact path="/heroes/add" component={AddHeroForm} />
              <Route exact path="/heroes/:id" component={HeroDetail} />
              <Route exact path="/dashboard" />
              <Route exact path="/signin" component={SignIn}/>
            </Switch>
          </PageBody>
        </Router>
      </div>
    );
  }
}