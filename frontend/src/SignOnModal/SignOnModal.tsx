import React from "react";
import Modal from "react-modal";
import Cookies from "universal-cookie";

import InputField from "../FormTools/InputField/InputField";
import PageTitle from "../PageTitle/PageTitle";
import { customStyles } from "./styles";
import "./SignOnModal.css";
import { store } from "../Notification/Notification";
import { requestPost } from "../misc/api";

interface IProps {
  isOpen: boolean;
  toggleModal: (isOpen: boolean) => void;
}

interface IState {
  form: {
    username: string;
    password: string;
  };
}

export default class SignOnModal extends React.Component<IProps, IState> {
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

  submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { form } = this.state;

    requestPost("/api/auth", form)
      .then((res) => {
        store.addNotification({
          message: "Login successfully!!",
          type: "success",
          timer: 2000
        });
        this.handleToggleModal();
        const cookie = new Cookies();
        cookie.set("auth_token", res.data.token);
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while creating the hero.",
          type: "error",
          timer: 2000
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
        <button className="submit" onClick={this.submitForm}>
          Log in
        </button>
      </Modal>
    );
  }
}
