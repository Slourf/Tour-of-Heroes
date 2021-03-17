import React from "react";
import "./FileField.css"


interface Props {
  id: string;
  name: string;
  value?: File;
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
            files: null
        }
    }

    handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(event);
        }
        this.setState({ files: event.target.files });
    }

    clearValue = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const { onClear } = this.props;

        if (onClear) {
            onClear(event);
        }
        this.setState({ files: null });
    }

    render() {
        const { id, name } = this.props;
        const { files } = this.state;

        return (
        <div>
            {!files? (
            <div>
                <label className="name"> {name} </label>
                <br />
                <button className="btn" type="button">
                <label htmlFor={id}>Parcourir</label>
                </button>
                <input id={id} name={name} type="file" className="file-input" onChange={this.handlechange} />
            </div>
            ) : (
            <div className="form-group">
                <label className="name">{name}</label>
                <br />
                <button id={id} className="btn" type="button" onClick={this.clearValue}>
                <label htmlFor={id}>&times;</label>
                </button>
                {files.length > 0 ? files.item(0)?.name : null}
            </div>
            )}
        </div>
        );
    }
}
