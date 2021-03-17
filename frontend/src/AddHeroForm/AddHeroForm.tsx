import React from "react";
import InputField from "../InputField/InputField";
import FileField from "../FileField/FileField";
import axios from "axios";
import { heroesUrl } from "../helpers";

interface Props {}

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
        .then()
        .catch(() => console.log("error"));
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (this.state.form) {
      console.log(this.state.form);
    }
    return (
      <div>
        <InputField
          id="name"
          name="Nom du hero"
          onChange={this.handleInputChange}
        />
        <InputField
          id="description"
          name="Description"
          onChange={this.handleInputChange}
        />
        <FileField
          id="logo"
          name="Logo"
          onChange={this.handleFileChange}
          onClear={this.handleFileClear}
        />
        <FileField
          id="image"
          name="image"
          onChange={this.handleFileChange}
          onClear={this.handleFileClear}
        />
        <button onClick={this.submitForm}>Créer</button>
      </div>
    );
  }
}
