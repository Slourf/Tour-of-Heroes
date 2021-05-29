import React from "react";
import { Field } from "react-final-form";

import "./TextField.css";

interface Props {
  id: string;
  name: string;
  style?: React.CSSProperties;
  required?: boolean;
}

export default class TextField extends React.Component<Props> {
  render() {
    const { id, style, name, required } = this.props;
    return (
      <Field<string> name={id}>
        {({ input, meta }) => {
          let errorStyle = {};
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
              <textarea
                {...input}
                id={id}
                style={{ ...style, ...errorStyle }}
                className="input-form"
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
