import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt from "jsonwebtoken";
import Cookies from "universal-cookie";
import NavBar from "../NavBar/NavBar";
import AddHeroForm from "../AddHeroForm/AddHeroForm";
import Heroes from "../Heroes/Heroes";
import PageBody from "../PageBody/PageBody";
import HeroDetail from "../HeroDetail/HeroDetail";
import Notification from "../Notification/Notification";
import SignIn from "../SignIn/SignIn";
import { AuthenticatedUser } from "../AuthenticatedUser/AuthenticatedUser";
import { User } from "../helpers";

import "./App.css";
import { requestGet } from "../misc/api";

interface IState {
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
  } | null;
}

interface IProps {}

export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      context: {
        authenticatedUser: null,
        clearAuthenticatedUser: this.clearAuthenticatedUser,
      },
    };
  }

  fetchAuthenticatedUser = () => {
    const cookie: Cookies = new Cookies();
    const auth_token = cookie.get("auth_token");
    if (!auth_token) return;

    const token = jwt.decode(auth_token);
    if (token === null) return;

    requestGet(`/api/users/${token.sub}`)
      .then((response) => {
        const user: User = response.data;

        this.setState({
          context: {
            authenticatedUser: user,
            clearAuthenticatedUser: this.clearAuthenticatedUser,
          },
        });
      })
      .catch((error) => {});
  };

  clearAuthenticatedUser = () => {
    this.setState({ context: null });
  };

  componentWillMount = () => {
    this.fetchAuthenticatedUser();
  };

  render() {
    return (
      <div id="toh-app">
        <AuthenticatedUser.Provider value={this.state.context}>
          <Router>
            <NavBar />
            <Notification />
            <PageBody>
              <Switch>
                <Route exact path="/" component={Heroes} />
                <Route exact path="/heroes" component={Heroes} />
                <Route exact path="/heroes/add" component={AddHeroForm} />
                <Route exact path="/heroes/:id" component={HeroDetail} />
                <Route exact path="/dashboard" />
                <Route exact path="/signin" component={SignIn} />
              </Switch>
            </PageBody>
          </Router>
        </AuthenticatedUser.Provider>
      </div>
    );
  }
}
