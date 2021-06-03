import { profile } from "console";
import React from "react";
import { Form } from "react-final-form";
import DateField from "../FormTools/DateField/DateField";
import InputField from "../FormTools/InputField/InputField";
import SelectField from "../FormTools/SelectField/SelectField";
import { User } from "../helpers";
import { requestGet } from "../misc/api";
import { withAuthenticatedUser } from "../misc/auth";
import { store } from "../Notification/Notification";
import PageTitle from "../PageTitle/PageTitle";
import { profileField, UserWithProfile } from "./helper";

import "./UserProfileForm.css";

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
  }[];
  // profileFieldSave: UserWithProfile;
}

class UserProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profileField,
    };
  }

  componentDidMount = () => {
    const { context } = this.props;
    if (context && context.authenticatedUser) {
      this.fetchUserProfile(context.authenticatedUser.id);
    }
  };

  fetchUserProfile = (id: string) => {
    requestGet(`/api/users/profile/${id}`)
      .then((res) => {
        this.setState({ profile: res.data });
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

    const fields = this.state.profileField;
    fields[fieldIndex].disabled = !fields[fieldIndex].disabled;

    await this.setState({
      ...this.state,
      profileField: fields,
    });
  };

  handleSubmit = (values: any) => {};

  render() {
    const { profile, profileField } = this.state;
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
              onSubmit={this.handleSubmit}
              initialValues={profile}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  <div style={{ display: "flex", width: "100%" }}>
                    {React.cloneElement(field.component, {
                      disabled: field.disabled,
                    })}
                    {field.disabled ? (
                      <button
                        className="profile-edit-button"
                        onClick={props.form.mutators.restorValue}
                      >
                        Edit
                      </button>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <button
                          className="profile-edit-button"
                          onClick={props.form.mutators.restorValue}
                        >
                          Cancel
                        </button>
                        <button className="profile-edit-button">Save</button>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </Form>
          );
        })}
      </div>
    );
  }
}

export default withAuthenticatedUser(UserProfile);
