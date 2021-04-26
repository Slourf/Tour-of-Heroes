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
import { AuthenticatedUser } from "../AuthenticatedUser/AuthenticatedUser";
import { User } from "../helpers";

import './App.css';

interface IState {
  authenticatedUser: User | null;
}

interface IProps {

}


export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      authenticatedUser: null
    };
  }


  fetchHeroes = () => {
    
  }

  componentWillMount = () => {

  }



  render() {
    return (
      <div id="toh-app">
        <AuthenticatedUser.Provider value={this.state.authenticatedUser}>
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
        </AuthenticatedUser.Provider>
      </div>
    );
  }
}