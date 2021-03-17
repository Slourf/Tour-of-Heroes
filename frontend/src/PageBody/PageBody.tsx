import React from "react"
import CSS from "csstype"

import "./PageBody.css"

interface Props {
    style?: CSS.Properties;
}

interface State {

}

export default class PageBody extends React.Component<Props, State> {

    render() {

        const { style } = this.props;
        return (
            <div id="page-body" style={{ ...style }}>
                {this.props.children}
            </div>
        );
    }
}