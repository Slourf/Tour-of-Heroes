import React from "react";
import { Form } from "react-final-form";
import { User } from "../../helpers";
import { requestGet, requestPost } from "../../misc/api";
import { withAuthenticatedUser } from "../../misc/auth";
import { store } from "../../Notification/Notification";
import PageTitle from "../../PageTools/PageTitle/PageTitle";
import { profileField, UserWithProfile } from "./helper";
import dateFormat from "dateformat";

import "./UserProfileForm.css";
import NewPasswordModal from "../NewPasswordModal/NewPasswordModal";

interface Props {
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
  } | null;
}

interface State {
  profile?: UserWithProfile;
  profileField: {
    id: string;
    component: JSX.Element;
    disabled: boolean;
    url: string;
  }[];
  isNewPasswordModalOpen: boolean;
  // profileFieldSave: UserWithProfile;
}

class UserProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profileField,
      isNewPasswordModalOpen: false,
    };
  }

  componentDidMount = () => {
    const { context } = this.props;
    if (context && context.authenticatedUser) {
      this.fetchUserProfile(context.authenticatedUser.id);
    }
  };

  toggleModal = () => {
    console.log(this.state);
    this.setState({
      ...this.state,
      isNewPasswordModalOpen: !this.state.isNewPasswordModalOpen,
    });
  };

  handleToggleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.toggleModal();
  };

  fetchUserProfile = (id: string) => {
    requestGet(`/api/users/profile/${id}`)
      .then((res) => {
        console.log(res.data);
        let stringBirthdate = "";
        if (res.data.birthdate) {
          console.log("formatting!!!!");
          stringBirthdate = dateFormat(res.data.birthdate, "dd/mm/yyyy");
          console.log(stringBirthdate);
        }
        this.setState({
          profile: {
            ...res.data,
            birthdate: stringBirthdate,
            password: "•".repeat(res.data.password_length),
          },
        });
      })
      .catch((res) => {
        store.addNotification({
          message: "An error occured while logging.",
          type: "error",
          timer: 3000,
        });
      });
  };

  handleToggleEdit = async (id: string) => {
    const { profileField } = this.state;
    const fieldIndex = profileField.findIndex((field) => field.id === id);
    if (fieldIndex === -1) {
      return;
    }
    console.log(id);
    const fields = this.state.profileField;
    fields[fieldIndex].disabled = !fields[fieldIndex].disabled;

    await this.setState({
      ...this.state,
      profileField: fields,
    });
  };

  handleSubmit = (values: any, id: string, url: string) => {
    requestPost(`${url}/${this.props.context?.authenticatedUser?.id}/${id}`, {
      [id]: values[id],
    })
      .then(() => {
        store.addNotification({
          message: "The was created sucessfully!",
          type: "success",
        });
      })
      .catch((err) => {
        store.addNotification({
          message: `${err.code} : ${err.message}`,
          type: "error",
        });
      });
    this.handleToggleEdit(id);
  };

  render() {
    const { profile, profileField, isNewPasswordModalOpen } = this.state;
    if (!profile) {
      return null;
    }
    return (
      <div>
        <PageTitle title="Personal informations" />
        {profileField.map((field) => {
          return (
            <Form
              mutators={{
                restorValue: (args, state, utils) => {
                  console.log("mutator");
                  utils.changeValue(state, field.id, () => {
                    if (!field.disabled) {
                      this.setState({
                        ...this.state,
                        profile: {
                          ...profile,
                          [field.id]: state.formState.values,
                        },
                      });
                    }
                    const savedValues: { [name: string]: any } = {
                      ...this.state.profile,
                    };

                    this.handleToggleEdit(field.id);
                    return savedValues[field.id];
                  });
                },
              }}
              onSubmit={(values) => {
                this.handleSubmit(values, field.id, field.url);
              }}
              initialValues={profile}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit} key={field.id}>
                  <div style={{ display: "flex", width: "100%" }}>
                    {React.cloneElement(field.component, {
                      disabled: field.disabled,
                    })}
                    {field.disabled ? (
                      <button
                        type="button"
                        className="profile-edit-button"
                        onClick={
                          field.id === "password"
                            ? this.handleToggleModal
                            : props.form.mutators.restorValue
                        }
                        style={{ backgroundColor: "#369", color: "white" }}
                      >
                        Edit
                      </button>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <button
                          type="button"
                          className="profile-edit-button"
                          onClick={props.form.mutators.restorValue}
                          style={{ backgroundColor: "red", color: "white" }}
                        >
                          Cancel
                        </button>
                        <button
                          className="profile-edit-button"
                          style={{ backgroundColor: "green", color: "white" }}
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </Form>
          );
        })}
        <NewPasswordModal
          isOpen={isNewPasswordModalOpen}
          toggleModal={this.toggleModal}
        />
      </div>
    );
  }
}

export default withAuthenticatedUser(UserProfile);
