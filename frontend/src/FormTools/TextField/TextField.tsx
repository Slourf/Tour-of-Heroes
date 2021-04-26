import React from "react"

import "./TextField.css"

interface Props {
    id: string;
    name: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface State {
    value?: string;
}

export default class TextField extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.value
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
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
                <textarea id={id} style={{ ...style }} value={value} className="input-form" onChange={this.handleChange} />
            </div>
        );
    }
}