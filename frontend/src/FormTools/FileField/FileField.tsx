import React from "react";
import { Field } from "react-final-form";
import "./FileField.css";

interface Props {
  id: string;
  name: string;
  value?: File;
  style?: React.CSSProperties;
  required?: boolean;
}

interface State {
  touched: boolean;
}

export default class FileField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      touched: false,
    };
  }

  hiddenFileInput = React.createRef<HTMLInputElement>();

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.hiddenFileInput.current) {
      this.hiddenFileInput.current.click();
      this.setState({ touched: true });
    }
  };

  handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    finalFormOnChange: any
  ) => {
    if (finalFormOnChange) {
      if (event.target.files) {
        finalFormOnChange(event.target.files[0]);
      }
    }
  };

  clearValue = (
    event: React.MouseEvent<HTMLButtonElement>,
    finalFormOnChange: (event: any) => void
  ) => {
    event.preventDefault();

    finalFormOnChange(null);
    if (this.hiddenFileInput.current) {
      this.hiddenFileInput.current.value = "";
    }
  };

  render() {
    const { id, name, style, required } = this.props;
    const { touched } = this.state;

    return (
      <div style={{ ...style }}>
        <Field<File> name={id}>
          {({ input: { value, onChange, ...input }, meta }) => {
            let errorStyle;
            if (touched && (meta.error || meta.submitError)) {
              errorStyle = {
                borderColor: "red",
              };
            }
            return (
              <div>
                <label className="name">
                  {name}
                  <span style={{ color: "red" }}>{required ? "*" : null}</span>
                </label>
                <br />

                {value ? (
                  <div className="input-file-filled">
                    <button
                      id={id}
                      className="input-file-delete"
                      type="button"
                      onClick={(e) => this.clearValue(e, onChange)}
                      style={errorStyle}
                    >
                      <label
                        htmlFor={id}
                        className="input"
                        style={{ color: "white" }}
                      >
                        &times;
                      </label>
                    </button>
                    <div className="input-file-data">{value.name}</div>
                  </div>
                ) : (
                  <div className="input-file">
                    <button
                      className="input-file"
                      type="button"
                      onClick={this.handleClick}
                      style={errorStyle}
                    >
                      <label htmlFor={id} className="input">
                        Browse
                      </label>
                    </button>
                  </div>
                )}
                <input
                  {...input}
                  id={id}
                  name={name}
                  type="file"
                  ref={this.hiddenFileInput}
                  className="file-input"
                  onChange={(e) => this.handleChange(e, onChange)}
                />

                {(meta.error || meta.submitError) && touched && (
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
      </div>
    );
  }
}
