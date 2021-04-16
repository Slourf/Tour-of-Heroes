import React from "react"
import CSS from "csstype"

import "./InputField.css"

interface Props {
    id: string;
    name: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface State {
    value?: string;
}

export default class InputField extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.value
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { onChange } = this.props;
        if (onChange) {
            onChange(event);
        }
        this.setState({...event.target});
    }

    render() {
        const { id, style, value, name } = this.props
        return (
            <div style={{ ...style }}>
                <label htmlFor={id}>{name}</label>
                <br />
                <input id={id} style={{ ...style }} type="text" value={value} className="input-form" onChange={this.handleChange} />
            </div>
        );
    }
}