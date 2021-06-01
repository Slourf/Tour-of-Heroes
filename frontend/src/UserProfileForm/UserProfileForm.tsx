import React from "react";
import { Form } from "react-final-form";
import InputField from "../FormTools/InputField/InputField";
import { User } from "../helpers";
import { requestGet } from "../misc/api";
import { withAuthenticatedUser } from "../misc/auth";
import { store } from "../Notification/Notification";
import PageTitle from "../PageTitle/PageTitle";
import { UserWithProfile } from "./helper";

interface Props {
  context: {
    authenticatedUser: User | null;
    clearAuthenticatedUser: () => void;
  } | null;
}

interface State {
  profile?: UserWithProfile;
}

class UserProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { context } = this.props;
    if (context && context.authenticatedUser) {
      this.fetchUserProfile(context.authenticatedUser.id);
    }
  };

  fetchUserProfile = (id: string) => {
    requestGet("/api/user/profile")
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

  handleSubmit = (values: any) => {};

  render() {
    const { profile } = this.state;
    if (!profile) {
      return null;
    }
    return (
      <div>
        <PageTitle title="test" />
        <Form onSubmit={this.handleSubmit} initialValues={profile}>
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <div style={{ display: "flex" }}>
                <InputField
                  id="firstname"
                  name="Firstname"
                  style={{ width: "100%" }}
                  disabled={true}
                />
                <button className="profile-edit-button" style={{}}>
                  Edit
                </button>
              </div>
              <InputField id="lastname" name="Lastname" disabled={true} />
              <InputField id="birthdate" name="Birthdate" />
              <InputField id="gender" name="Gender" />
              <InputField id="phone_number" name="Phone N°" />
              <button type="submit" className="submit">
                Update
              </button>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

export default withAuthenticatedUser(UserProfile);
