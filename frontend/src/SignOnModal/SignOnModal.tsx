import React from 'react';
import Modal from 'react-modal';
import InputField from '../InputField/InputField';
import PageTitle from '../PageTitle/PageTitle';
import { customStyles } from './styles';
import "./SignOnModal.css";


interface IProps {
    isOpen: boolean;
    toggleModal: (isOpen: boolean) => void;
}

export default class SignOnModal extends React.Component<IProps> {
    constructor (props: IProps) {
        super(props);
        this.state = {
          isOpen: false
        };
    }

    handleToggleModal = () => {
        const { isOpen, toggleModal } = this.props;
        toggleModal(isOpen);
    }

    handleInputChange = () => {

    }

    render() {
        const { isOpen } = this.props;
        return (
            <Modal
                isOpen={isOpen}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <PageTitle title="Sign On" />
                    <div className="modal-close-button" onClick={this.handleToggleModal}>&#10005;</div>
                </div>

            <InputField
                id="login"
                name="Login"
                style={{ marginTop: ".575rem" }}
                onChange={this.handleInputChange}
            />
            <InputField
                id="password"
                name="Password"
                style={{ marginTop: ".575rem" }}
                onChange={this.handleInputChange}
            />
            <button className="submit">Log in</button>
            </Modal>
        );

    }
}