import React from "react"
import CSS from "csstype"

import "./PageBody.css"

interface Props {
    style?: CSS.Properties;
}

export default class PageBody extends React.Component<Props> {

    render() {

        const { style } = this.props;
        return (
            <div id="page-body" style={{ ...style }}>
                {this.props.children}
            </div>
        );
    }
}