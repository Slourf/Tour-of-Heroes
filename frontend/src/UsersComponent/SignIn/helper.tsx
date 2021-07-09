import React from "react";

export class PasswordPolicy extends React.PureComponent {
  render() {
    return (
      <div>
        The password must :
        <ul>
          <li>contain at least 1 lowercase alphabetical character</li>
          <li>contain at least 1 uppercase alphabetical character</li>
          <li>contain at least 1 numeric character</li>
          <li>contain at least one special character</li>
          <li>be at eight characters or longer</li>
        </ul>
      </div>
    );
  }
}
