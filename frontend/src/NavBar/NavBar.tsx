import React from "react";
import { Link } from "react-router-dom";
import SignOnModal from "../SignOnModal/SignOnModal";
import { withAuthenticatedUser } from "../misc/auth";

import "./NavBar.css";

interface Props {}

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
  toggleModal = (isOpen: boolean) => {
    this.setState({
      ...this.state,
      isSignOnModalOpen: !this.state.isSignOnModalOpen,
    });
  };

  handleToggleModal = (event: React.MouseEvent<HTMLDivElement>) => {
    this.toggleModal(this.state.isSignOnModalOpen);
  };

  render() {
    const { isSignOnModalOpen } = this.state;
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
          <div className="header-account-item" onClick={this.handleToggleModal}>
            Sign On
          </div>
          <Link to="/signin">
            <div className="header-account-item">
                Sign In
            </div>
          </Link>
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