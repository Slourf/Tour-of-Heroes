import React from "react";
import Modal from "react-modal";
import Cookies from "universal-cookie";

import InputField from "../FormTools/InputField/InputField";
import PageTitle from "../PageTitle/PageTitle";
import { customStyles } from "./styles";
import "./SignOnModal.css";
import { store } from "../Notification/Notification";
import { requestPost } from "../misc/api";
import { withAuthenticatedUser } from "../misc/auth";
import { User } from "../helpers";
import { useHistory } from "react-router";

interface IProps {
  isOpen: boolean;
  toggleModal: (isOpen: boolean) => void;
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
    fetchAuthenticatedUser: () => void;
  } | null;
}

interface IState {
  form: {
    username: string;
    password: string;
  };
}

class SignOnModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      form: {
        username: "",
        password: "",
      },
    };
  }

  handleToggleModal = () => {
    const { isOpen, toggleModal } = this.props;
    toggleModal(isOpen);
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;
    this.setState({ form: { ...form, [id]: value } });
  };

  submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { form } = this.state;

    requestPost("/api/auth", form)
      .then((res) => {
        store.addNotification({
          message: "Login successfully!!",
          type: "success",
          timer: 3000
        });
        this.handleToggleModal();

        const cookie = new Cookies();
        cookie.set("auth_token", res.data.token);

        const { context } = this.props;
        if (context !== null) {
          context.fetchAuthenticatedUser();
        }
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while logging.",
          type: "error",
          timer: 3000
        });
      });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} style={customStyles} contentLabel="Example Modal">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle title="Sign On" />
          <div className="modal-close-button" onClick={this.handleToggleModal}>
            &#10005;
          </div>
        </div>
        <form onSubmit={this.submitForm}>
          <InputField
            id="username"
            name="Login"
            style={{ marginTop: ".575rem" }}
            onChange={this.handleInputChange}
          />
          <InputField
            id="password"
            name="Password"
            type="password"
            style={{ marginTop: ".575rem" }}
            onChange={this.handleInputChange}
          />
          <button type="submit" className="submit">
            Log in
          </button>
        </form>
      </Modal>
    );
  }
}
export default withAuthenticatedUser(SignOnModal);