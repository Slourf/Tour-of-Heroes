import React from "react";
import { Field } from "react-final-form";
import ReactTooltip from "react-tooltip";

import "./SelectField.css";

interface Props {
  id: string;
  name: string;
  style?: React.CSSProperties;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  info?: string;
}

export default class SelectField extends React.Component<Props> {
  render() {
    const { id, style, name, required, info, disabled } = this.props;
    let errorStyle = {};
    let disabledStyle = {};

    if (disabled) {
      disabledStyle = {
        cursor: "not-allowed",
      };
    }
    return (
      <Field<string> name={id}>
        {({ input, meta }) => {
          if (meta.touched && (meta.error || meta.submitError)) {
            errorStyle = {
              borderColor: "red",
            };
          }
          return (
            <div style={{ ...style, position: "relative" }}>
              <label htmlFor={id}>
                {name}
                <span style={{ color: "red" }}>{required ? "*" : null}</span>
                {info && (
                  <span data-tip={info} style={{ fontStyle: "normal" }}>
                    {" "}
                    &#9432;
                    <ReactTooltip type="info" html={true} />
                  </span>
                )}
              </label>
              <br />
              <select
                {...input}
                id={id}
                style={{ ...style, ...errorStyle, ...disabledStyle }}
                className="input-form"
                disabled={disabled}
              >
                {this.props.children}
              </select>
              <div className="select-icon">
                <svg
                  focusable="false"
                  viewBox="0 0 104 128"
                  width="25"
                  height="35"
                  className="icon"
                >
                  <path d="m2e1 95a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm0-3e1a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm0-3e1a9 9 0 0 1 -9 9 9 9 0 0 1 -9 -9 9 9 0 0 1 9 -9 9 9 0 0 1 9 9zm14 55h68v1e1h-68zm0-3e1h68v1e1h-68zm0-3e1h68v1e1h-68z"></path>
                </svg>
              </div>
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
