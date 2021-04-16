import React from "react";
import InputField from "../InputField/InputField";
import axios from "axios";
import { heroesUrl } from "../helpers";
import { store } from "../Notification/Notification"

import "./SignIn.css"
import PageTitle from "../PageTitle/PageTitle";
import { RouteComponentProps } from "react-router-dom";

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

  submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = new FormData();
    const credentials = this.state.form;

    if (credentials.username && credentials.password) {
        form.append('username', credentials.username);
        form.append('password', credentials.password);

        axios
        .post(heroesUrl, form)
        .then(() => {
          store.addNotification({ message: "Your account was created sucessfully!", type: "success"});
          this.props.history.push("/heroes");
        })
        .catch(() => {
          store.addNotification({ message: "An error occured while creating your account.", type: "error"});
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
        <InputField
          id="name"
          name="Username"
          style={{ marginTop: ".575rem" }}
          onChange={this.handleInputChange}
        />
        <InputField
          id="password"
          name="Password"
          style={{ marginTop: ".575rem" }}
          onChange={this.handleInputChange}
        />
        <InputField
          id="confirmed-password"
          name="Confirm password"
          style={{ marginTop: ".575rem" }}
          onChange={this.handleInputChange}
        />
        <button onClick={this.submitForm} className="submit">Create account</button>
      </div>
    );
  }
}