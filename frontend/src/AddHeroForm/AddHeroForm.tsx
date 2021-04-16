import React from "react";
import InputField from "../InputField/InputField";
import FileField from "../FileField/FileField";
import axios from "axios";
import { heroesUrl } from "../helpers";
import { store } from "../Notification/Notification"

import "./AddHeroForm.css"
import PageTitle from "../PageTitle/PageTitle";
import TextField from "../TextField/TextField";
import { RouteComponentProps } from "react-router-dom";

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

  submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const form = new FormData();
    const hero = this.state.form;

    if (hero.description && hero.image && hero.logo && hero.name) {
        form.append('name', hero.name);
        form.append('description', hero.description);
        form.append('image', hero.image, hero.image.name);
        form.append('logo', hero.logo, hero.logo.name);

        axios
        .post(heroesUrl, form)
        .then(() => {
          store.addNotification({ message: "The hero was created sucessfully!", type: "success"});
          this.props.history.push("/heroes");
        })
        .catch(() => {
          store.addNotification({ message: "An error occured while creating the hero.", type: "error"});
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
        <PageTitle title="Création de héro" />
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
        <div style={{ display:"flex", width: "100%", marginTop: ".575rem" }}>
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
        <button onClick={this.submitForm} className="submit">Créer</button>
      </div>
    );
  }
}
