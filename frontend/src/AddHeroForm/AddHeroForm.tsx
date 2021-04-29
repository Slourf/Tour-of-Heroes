import React from "react";
import { Form } from "react-final-form";
import InputField from "../FormTools/InputField/InputField";
import FileField from "../FormTools/FileField/FileField";
import { store } from "../Notification/Notification";

import "./AddHeroForm.css";
import PageTitle from "../PageTitle/PageTitle";
import TextField from "../FormTools/TextField/TextField";
import { RouteComponentProps } from "react-router-dom";
import { requestPost } from "../misc/api";

interface Props extends RouteComponentProps {}

interface State {
  form: {
    name?: string;
    description?: string;
    image?: File;
    logo?: File;
  };
}

export default class AddHeroFrom extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      form: {},
    };
  }

  handleSubmitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = new FormData();
    const hero = this.state.form;

    if (hero.description && hero.image && hero.logo && hero.name) {
      form.append("name", hero.name);
      form.append("description", hero.description);
      form.append("image", hero.image, hero.image.name);
      form.append("logo", hero.logo, hero.logo.name);

      requestPost("/api/heroes", form)
        .then(() => {
          store.addNotification({
            message: "The hero was created sucessfully!",
            type: "success",
          });
          this.props.history.push("/heroes");
        })
        .catch(() => {
          store.addNotification({
            message: "An error occured while creating the hero.",
            type: "error",
          });
        });
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;
    this.setState({ form: { ...form, [id]: value } });
    console.log(this.state);
  };

  handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;
    this.setState({ form: { ...form, [id]: value } });
    console.log(this.state);
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
        <PageTitle title="Création de héro" />
        <Form onSubmit={this.handleSubmitForm}>
          {(props) => (
            <form action="">
              <InputField
                id="name"
                name="Nom du hero"
                style={{ marginTop: ".575rem" }}
                onChange={this.handleInputChange}
              />
              <TextField
                id="description"
                name="Description"
                style={{ marginTop: ".575rem" }}
                onChange={this.handleTextInputChange}
              />
              <div
                style={{ display: "flex", width: "100%", marginTop: ".575rem" }}
              >
                <FileField
                  id="logo"
                  name="Logo"
                  style={{ width: "48%", marginRight: "2%" }}
                  onChange={this.handleFileChange}
                  onClear={this.handleFileClear}
                />
                <FileField
                  id="image"
                  name="Image"
                  style={{ width: "48%", marginLeft: "2%" }}
                  onChange={this.handleFileChange}
                  onClear={this.handleFileClear}
                />
              </div>
              <button onClick={this.handleSubmitForm} className="submit">
                Créer
              </button>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
