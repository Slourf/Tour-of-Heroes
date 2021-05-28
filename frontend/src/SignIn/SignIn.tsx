import React from "react";
import InputField from "../FormTools/InputField/InputField";
import { store } from "../Notification/Notification";

import "./SignIn.css";
import PageTitle from "../PageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";
import { requestGet, requestPost } from "../misc/api";
import { Form } from "react-final-form";

interface Props extends RouteComponentProps {}

interface State {
  form: {
    username?: string;
    password?: string;
  };
}

export default class AddHeroFrom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      form: {},
    };
  }

  isUsernameAvailable = async (username: string) => {
    const toto = await requestGet(`/api/user/exist/${username}`);
    return toto;
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
    } else if (!this.isUsernameAvailable(values.username)) {
      errors.username = "This username is not available!";
    }
    if (!values.password) {
      errors.password = "This field is required!";
      valid = false;
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

  handleValidation = (values: any) => {
    const errors = this.checkValidation(values);
    console.log(errors);
    if (errors) {
      return errors;
    }
    return {};
  };

  handleSubmitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = new FormData();
    const credentials = this.state.form;

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

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;
    this.setState({ form: { ...form, [id]: value } });
  };

  handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;
    this.setState({ form: { ...form, [id]: value } });
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = event.target;
    const { form } = this.state;

    if (files && files.length > 0) {
      this.setState({ form: { ...form, [id]: files[0] } });
    } else {
      this.setState({ form: { ...form, [id]: undefined } });
    }
  };

  handleFileClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    console.log(event.currentTarget);
    const { form } = this.state;

    this.setState({ form: { ...form, [id]: undefined } });
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
