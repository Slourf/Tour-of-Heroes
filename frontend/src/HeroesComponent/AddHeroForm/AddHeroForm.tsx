import React from "react";
import { Form } from "react-final-form";
import InputField from "../../FormTools/InputField/InputField";
import FileField from "../../FormTools/FileField/FileField";
import { store } from "../../Notification/Notification";

import "./AddHeroForm.css";
import PageTitle from "../../PageTools/PageTitle/PageTitle";
import TextField from "../../FormTools/TextField/TextField";
import { RouteComponentProps } from "react-router-dom";
import { requestPost } from "../../misc/api";

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

  handleSubmitForm = (values: any) => {
    const form = new FormData();
    const errors = this.checkValidation(values);
    if (errors) {
      return errors;
    }

    if (values.description && values.image && values.logo && values.name) {
      form.append("name", values.name);
      form.append("description", values.description);
      form.append("image", values.image, values.image.name);
      form.append("logo", values.logo, values.logo.name);

      requestPost("/api/heroes", form)
        .then(() => {
          store.addNotification({
            message: "The hero was created sucessfully!",
            type: "success",
          });
          this.props.history.push("/heroes");
        })
        .catch((err) => {
          store.addNotification({
            message: `${err.code} : ${err.message}`,
            type: "error",
          });
        });
    }
  };

  checkValidation = (values: any) => {
    const errors = {
      name: "",
      description: "",
      image: "",
      logo: "",
    };
    let valid = true;

    if (!values.name) {
      errors.name = "This field is required!";
      valid = false;
    }
    if (!values.description) {
      errors.description = "This field is required!";
      valid = false;
    }
    if (!values.logo) {
      errors.logo = "This field is required!";
      valid = false;
    }
    if (!values.image) {
      errors.image = "This field is required!";
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

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const { form } = this.state;

    this.setState({
      ...this.state,
      form: { ...form, [id]: value },
    });
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
    const { form } = this.state;

    this.setState({ form: { ...form, [id]: undefined } });
  };

  render() {
    return (
      <div>
        <PageTitle title="Create hero" />
        <Form onSubmit={this.handleSubmitForm} validate={this.handleValidation}>
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <InputField
                id="name"
                name="Name"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <TextField
                id="description"
                name="Description"
                style={{ marginTop: ".575rem" }}
                required={true}
              />
              <div
                style={{ display: "flex", width: "100%", marginTop: ".575rem" }}
              >
                <FileField
                  id="logo"
                  name="Logo"
                  style={{ width: "48%", marginRight: "2%" }}
                  required={true}
                />
                <FileField
                  id="image"
                  name="Image"
                  style={{ width: "48%", marginLeft: "2%" }}
                  required={true}
                />
              </div>
              <button type="submit" className="submit">
                Créer
              </button>
            </form>
          )}
        </Form>
      </div>
    );
  }
}
