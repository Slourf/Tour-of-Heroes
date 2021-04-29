import React from "react";
import { Field } from "react-final-form";

import "./InputField.css";

interface Props {
  id: string;
  name: string;
  style?: React.CSSProperties;
  value?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface State {
  value?: string;
}

export default class InputField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(event);
    }
    this.setState({ ...event.target });
  }

  render() {
    const { id, style, value, name, type } = this.props;
    return (
      <div style={{ ...style }}>
        <label htmlFor={id}>{name}</label>
        <br />
        <Field name={id} type={type} value={value} onChange={this.handleChange}>
          {(props) => (
            <input
              {...props}
              id={id}
              style={{ ...style }}
              className="input-form"
            />
          )}
        </Field>
      </div>
    );
  }
}
