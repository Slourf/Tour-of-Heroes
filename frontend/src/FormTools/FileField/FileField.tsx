import React from "react";
import { Field } from "react-final-form";
import "./FileField.css";

interface Props {
  id: string;
  name: string;
  value?: File;
  style?: React.CSSProperties;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface State {
  files: FileList | null;
}

export default class FileField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      files: null,
    };
  }

  hiddenFileInput = React.createRef<HTMLInputElement>();

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.hiddenFileInput.current != null) {
      this.hiddenFileInput.current.click();
    }
  };

  handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(event);
    }
    this.setState({ files: event.target.files });
  };

  clearValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { onClear } = this.props;

    if (onClear) {
      onClear(event);
    }
    this.setState({ files: null });
  };

  render() {
    const { id, name, style } = this.props;
    const { files } = this.state;

    return (
      <div style={{ ...style }}>
        <Field name={id}>
          {(props) => {
            if (!files) {
              return (
                <div>
                  <label className="name"> {name} </label>
                  <br />
                  <div className="input-file">
                    <button
                      className="input-file"
                      type="button"
                      onClick={this.handleClick}
                    >
                      <label htmlFor={id} className="input">
                        Parcourir
                      </label>
                    </button>
                    <input
                      {...props}
                      id={id}
                      name={name}
                      type="file"
                      ref={this.hiddenFileInput}
                      className="file-input"
                      onChange={this.handlechange}
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div className="form-group">
                  <label className="name">{name}</label>
                  <br />
                  <div className="input-file-filled">
                    <button
                      id={id}
                      className="input-file-delete"
                      type="button"
                      onClick={this.clearValue}
                    >
                      <label
                        htmlFor={id}
                        className="input"
                        style={{ color: "white" }}
                      >
                        &times;
                      </label>
                    </button>
                    <div className="input-file-data">
                      {files.length > 0 ? files.item(0)?.name : null}
                    </div>
                  </div>
                </div>
              );
            }
          }}
        </Field>
      </div>
    );
  }
}
