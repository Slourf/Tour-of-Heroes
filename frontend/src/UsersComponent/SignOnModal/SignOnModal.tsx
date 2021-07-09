import React from "react";
import Modal from "react-modal";
import { Form } from "react-final-form";
import Cookies from "universal-cookie";

import InputField from "../../FormTools/InputField/InputField";
import PageTitle from "../../PageTools/PageTitle/PageTitle";
import { customStyles } from "./styles";
import "./SignOnModal.css";
import { store } from "../../Notification/Notification";
import { requestPost } from "../../misc/api";
import { withAuthenticatedUser } from "../../misc/auth";
import { User } from "../../helpers";

interface IProps {
  isOpen: boolean;
  toggleModal: (isOpen: boolean) => void;
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
    fetchAuthenticatedUser: () => void;
  } | null;
}

class SignOnModal extends React.Component<IProps> {
  checkValidation = (values: any) => {
    const errors = {
      username: "",
      password: "",
    };
    let valid = true;

    if (!values.username) {
      errors.username = "This field is required!";
      valid = false;
    }
    if (!values.password) {
      errors.password = "This field is required!";
      valid = false;
    }
    if (valid) {
      return null;
    }
    return errors;
  };

  handleValidation = (values: any) => {
    const errors = this.checkValidation(values);
    if (errors) {
      return errors;
    }
    return {};
  };

  handleToggleModal = () => {
    const { isOpen, toggleModal } = this.props;
    toggleModal(isOpen);
  };

  handleSubmitForm = (values: any) => {
    // event.preventDefault();

    const credentials = {
      username: values.username,
      password: values.password,
    };

    requestPost("/api/auth", credentials)
      .then((res) => {
        store.addNotification({
          message: "Login successfully!!",
          type: "success",
          timer: 3000,
        });
        this.handleToggleModal();

        const cookie = new Cookies();
        cookie.set("auth_token", res.data.token);

        const { context } = this.props;
        if (context !== null) {
          context.fetchAuthenticatedUser();
        }
        window.location.reload();
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while logging.",
          type: "error",
          timer: 3000,
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
        <Form onSubmit={this.handleSubmitForm} validate={this.handleValidation}>
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <InputField
                id="username"
                name="Login"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <InputField
                id="password"
                name="Password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <button type="submit" className="submit">
                Log in
              </button>
            </form>
          )}
        </Form>
      </Modal>
    );
  }
}
export default withAuthenticatedUser(SignOnModal);
