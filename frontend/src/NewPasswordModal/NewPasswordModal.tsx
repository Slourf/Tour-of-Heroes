import React from "react";
import Modal from "react-modal";
import { Form } from "react-final-form";
import Cookies from "universal-cookie";

import InputField from "../FormTools/InputField/InputField";
import PageTitle from "../PageTitle/PageTitle";
import { customStyles } from "./styles";
import "./NewPasswordModal.css";
import { store } from "../Notification/Notification";
import { requestPost } from "../misc/api";
import { withAuthenticatedUser } from "../misc/auth";
import { User } from "../helpers";
import ReactDOMServer from "react-dom/server";
import { PasswordPolicy } from "../SignIn/helper";

interface IProps {
  isOpen: boolean;
  userId: string;
  toggleModal: (isOpen: boolean) => void;
}

class SignOnModal extends React.Component<IProps> {
  checkValidation = (values: any) => {
    const errors = {
      current_password: "",
      new_password: "",
      new_password_confirm: "",
    };
    let valid = true;

    if (!values.current_password) {
      errors.current_password = "This field is required!";
      valid = false;
    }

    if (!values.new_password) {
      errors.new_password = "This field is required!";
      valid = false;
    } else {
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      if (!strongRegex.test(values.password)) {
        errors.new_password = "The password doesn't match the password policy!";
        valid = false;
      }
    }

    if (!values.new_password_confirm) {
      errors.new_password_confirm = "This field is required!";
      valid = false;
    } else if (values.new_password_confirm !== values.new_password) {
      errors.new_password_confirm = "Both passwords must be identical!";
      valid = false;
    }

    // implemente a password policy
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
    const credentials = {
      current_password: values.current_password,
      new_password: values.new_password,
    };
    const { userId } = this.props;

    requestPost(`/api/users/${userId}/password`, credentials)
      .then((res) => {
        store.addNotification({
          message: "Password changed successfully!!",
          type: "success",
          timer: 3000,
        });
        this.handleToggleModal();
      })
      .catch(() => {
        store.addNotification({
          message: "An error occured while changing the password.",
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
          <PageTitle title="Change password" />
          <div className="modal-close-button" onClick={this.handleToggleModal}>
            &#10005;
          </div>
        </div>
        <Form
          onSubmit={this.handleSubmitForm}
          validate={this.handleValidation}
          validateOnBlur={true}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <InputField
                id="current_password"
                name="Current password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <InputField
                id="new_password"
                name="New password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
                info={ReactDOMServer.renderToString(<PasswordPolicy />)}
              />
              <InputField
                id="new_password_confirm"
                name="Confirm new Password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <button type="submit" className="submit">
                Save
              </button>
            </form>
          )}
        </Form>
      </Modal>
    );
  }
}
export default withAuthenticatedUser(SignOnModal);
