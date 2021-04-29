import React from "react";
import CSS from "csstype";

import "./PageTitle.css";

interface Props {
  style?: CSS.Properties;
  title: string;
}

export default class PageTitle extends React.Component<Props> {
  render() {
    const { style, title } = this.props;
    return (
      <div id="page-title" style={{ ...style }}>
        {title}
      </div>
    );
  }
}
