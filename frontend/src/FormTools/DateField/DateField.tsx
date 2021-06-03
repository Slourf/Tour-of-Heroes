import React from "react";
import { Field } from "react-final-form";
import ReactTooltip from "react-tooltip";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import "./DateField.css";

interface Props {
  id: string;
  name: string;
  style?: React.CSSProperties;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  info?: string;
}

export default class InputField extends React.Component<Props> {
  render() {
    const { id, style, name, required, info, disabled } = this.props;
    let errorStyle = {};
    return (
      <Field name={id}>
        {({ input, meta }) => {
          if (meta.touched && (meta.error || meta.submitError)) {
            errorStyle = {
              borderColor: "red",
            };
          }
          console.log(input.value, typeof input.value);
          return (
            <div style={{ ...style }}>
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
              <div className="date-picker-width">
                <DatePicker
                  {...input}
                  id={id}
                  className="input-form"
                  dateFormat="dd/MM/yyyy"
                  disabled={disabled}
                  onChange={(date: Date) => {
                    // On Change, you should use final-form Field Input prop to change the value
                    const dateFormatted = format(date, "dd/MM/yyyy");
                    input.onChange(dateFormatted);
                  }}
                  autoComplete="off"
                />
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
