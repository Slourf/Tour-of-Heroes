import React from "react";
import { Field } from "react-final-form";

import "./InputField.css";

interface Props {
  id: string;
  name: string;
  style?: React.CSSProperties;
  value?: string;
  type?: string;
  required?: boolean;
}

export default class InputField extends React.Component<Props> {
  render() {
    const { id, style, name, type, required } = this.props;
    let errorStyle = {};
    return (
      <Field<string> name={id}>
        {({ input, meta }) => {
          if (meta.touched && (meta.error || meta.submitError)) {
            errorStyle = {
              borderColor: "red",
            };
          }
          return (
            <div style={{ ...style }}>
              <label htmlFor={id}>
                {name}
                <span style={{ color: "red" }}>{required ? "*" : null}</span>
              </label>
              <br />
              <input
                {...input}
                id={id}
                type={type}
                style={{ ...style, ...errorStyle }}
                className="input-form"
                required={required}
              />
              {(meta.error || meta.submitError) && meta.touched && (
                <div
                  style={{
                    fontSize: "15px",
                    color: "red",
                    fontStyle: "italic",
                  }}
                >
                  {meta.error || meta.submitError}
                </div>
              )}
            </div>
          );
        }}
      </Field>
    );
  }
}
