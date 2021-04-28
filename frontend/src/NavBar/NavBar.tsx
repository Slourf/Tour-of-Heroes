import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import SignOnModal from "../SignOnModal/SignOnModal";
import { withAuthenticatedUser } from "../misc/auth";

import "./NavBar.css";
import { User } from "../helpers";
import Cookies from "universal-cookie";

interface Props {
  authenticatedUser: User;
  context: { 
    authenticatedUser: User | null,
    clearAuthenticatedUser: () => void
  } | null
}

interface State {
  isSignOnModalOpen: boolean;
}

class NavBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSignOnModalOpen: false,
    };
  }
  toggleModal = () => {
    this.setState({
      ...this.state,
      isSignOnModalOpen: !this.state.isSignOnModalOpen,
    });
  };

  handleToggleModal = (event: React.MouseEvent<HTMLDivElement>) => {
    this.toggleModal();
  };

  handleLogOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.context === null)
      return;
    this.props.context.clearAuthenticatedUser();
    const cookie: Cookies = new Cookies();
    cookie.remove("auth_token");
  }

  render() {
    const { isSignOnModalOpen } = this.state;
    if (!this.props.context)
      return;
    const { authenticatedUser } = this.props.context;
    console.log(authenticatedUser);
    return (
      <div id="header">
        <Link to="/heroes">
          <div id="title" className="header-container">
            <h1>Tour of Heroes</h1>
          </div>
        </Link>
        <div className="header-container">
          <nav>
            <Link to="/heroes" className="nav-item">Heroes</Link>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/heroes/add" className="nav-item">+ Hero</Link>
          </nav>
        </div>
        <div className="header-account">
          {!authenticatedUser ? 
            <Fragment>
              <div className="header-account-item" onClick={this.handleToggleModal}>
                Sign On
              </div>
              <Link to="/signin">
                <div className="header-account-item">
                    Sign In
                </div>
              </Link>
            </Fragment>
            :
            <Fragment>
              <div className="header-account-item">{authenticatedUser.username}</div>
              <div className="header-account-item" onClick={this.handleLogOut}>Log out</div>
            </Fragment>
          }
        </div>
        <SignOnModal
          isOpen={isSignOnModalOpen}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default withAuthenticatedUser(NavBar);