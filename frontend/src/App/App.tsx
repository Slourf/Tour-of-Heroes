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
import UserProfileForm from "../UserProfileForm/UserProfileForm";
import { AuthenticatedUser } from "../AuthenticatedUser/AuthenticatedUser";
import { User } from "../helpers";

import "./App.css";

interface Props {}

interface State {
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
    fetchAuthenticatedUser: () => void;
  } | null;
  isContextSetup: boolean;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      context: {
        authenticatedUser: null,
        clearAuthenticatedUser: this.clearAuthenticatedUser,
        fetchAuthenticatedUser: this.fetchAuthenticatedUser,
      },
      isContextSetup: false,
    };
  }

  fetchAuthenticatedUser = () => {
    const cookie: Cookies = new Cookies();
    const auth_token = cookie.get("auth_token");
    if (!auth_token) return;
    const token = jwt.decode(auth_token);
    if (token === null) return;
    if (typeof token === "string") return;

    this.setState({
      context: {
        authenticatedUser: {
          id: token.sub,
          username: token.name,
          admin: token.admin,
        },
        clearAuthenticatedUser: this.clearAuthenticatedUser,
        fetchAuthenticatedUser: this.fetchAuthenticatedUser,
      },
      isContextSetup: true,
    });
  };

  clearAuthenticatedUser = () => {
    this.setState({
      context: {
        authenticatedUser: null,
        clearAuthenticatedUser: this.clearAuthenticatedUser,
        fetchAuthenticatedUser: this.fetchAuthenticatedUser,
      },
    });
  };

  componentDidMount = () => {
    this.fetchAuthenticatedUser();
  };

  render() {
    const { context, isContextSetup } = this.state;
    if (!isContextSetup) {
      return null;
    }
    return (
      <div id="toh-app">
        <AuthenticatedUser.Provider value={context}>
          <Router>
            <NavBar />
            <Notification />
            <PageBody>
              <Switch>
                <Route exact path="/" component={Heroes} />
                <Route exact path="/profile" component={UserProfileForm} />
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
