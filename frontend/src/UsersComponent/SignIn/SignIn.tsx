import React from "react";
import ReactDOMServer from "react-dom/server";
import InputField from "../../FormTools/InputField/InputField";
import { store } from "../../Notification/Notification";

import "./SignIn.css";
import PageTitle from "../../PageTools/PageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";
import { requestGet, requestPost } from "../../misc/api";
import { Form } from "react-final-form";
import { PasswordPolicy } from "./helper";

interface Props extends RouteComponentProps {}

export default class AddHeroFrom extends React.Component<Props> {
  isUsernameAvailable = async (username: string) => {
    return (await requestGet(`/api/users/exist/${username}`)).data;
  };

  checkValidation = async (values: any) => {
    const errors = {
      username: "",
      password: "",
      confirmedPassword: "",
    };
    let valid = true;
    if (!values.username) {
      errors.username = "This field is required!";
      valid = false;
    } else {
      const isUsernameAvailable = await this.isUsernameAvailable(
        values.username
      );
      if (!isUsernameAvailable) {
        errors.username = "This username is not available!";
        valid = false;
      }
    }

    if (!values.password) {
      errors.password = "This field is required!";
      valid = false;
    } else {
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      if (!strongRegex.test(values.password)) {
        errors.password = "The password doesn't match the password policy!";
        valid = false;
      }
    }
    if (!values.confirmedPassword) {
      errors.confirmedPassword = "This field is required!";
      valid = false;
    } else if (values.confirmedPassword !== values.password) {
      errors.confirmedPassword = "Both passwords must be identical!";
      valid = false;
    }
    // implemente a password policy
    if (valid) {
      return null;
    }
    return errors;
  };

  handleValidation = async (values: any) => {
    const errors = await this.checkValidation(values);
    if (errors) {
      return errors;
    }
    return {};
  };

  handleSubmitForm = (values: any) => {
    const form = new FormData();
    const credentials = values;

    if (credentials.username && credentials.password) {
      form.append("username", credentials.username);
      form.append("password", credentials.password);

      requestPost("/api/users", form)
        .then(() => {
          store.addNotification({
            message: "Your account was created sucessfully!",
            type: "success",
          });
          this.props.history.push("/heroes");
        })
        .catch(() => {
          store.addNotification({
            message: "An error occured while creating your account.",
            type: "error",
          });
        });
    }
  };

  render() {
    return (
      <div>
        <PageTitle title="Sign In" />
        <Form
          onSubmit={this.handleSubmitForm}
          validate={this.handleValidation}
          validateOnBlur={true}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <InputField
                id="username"
                name="Username"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <InputField
                id="password"
                name="Password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
                info={ReactDOMServer.renderToString(<PasswordPolicy />)}
              />
              <InputField
                id="confirmedPassword"
                name="Confirm password"
                type="password"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <button type="submit" className="submit">
                Create account
              </button>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
