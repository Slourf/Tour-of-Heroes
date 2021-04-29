import { AuthenticatedUser } from "../AuthenticatedUser/AuthenticatedUser";

export const withAuthenticatedUser = (Component: any) => {
  return (props: any) => {
    return (
      <AuthenticatedUser.Consumer>
        {(context) => {
          return <Component {...props} context={context} />;
        }}
      </AuthenticatedUser.Consumer>
    );
  };
};
