import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import api from '../api'
import { FormErrors } from './FormErrors';
import styled from "styled-components";

const Form = styled.div.attrs({
    className: 'Form',
})`
    width: 500px; 
    margin: auto;
    margin-top:70px;
`;

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            randomCode: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false
        }
    }

    handleChangeInputEmail = async event => {
        const email = event.target.value;
        const name = 'email';
        this.setState({ email },
            () => { this.validateField(name, email) })
    };

    handleChangeInputUsername = async event => {
        const username = event.target.value;
        this.setState({ username })
    };

    handleChangeInputPassword = async event => {
        const password = event.target.value;
        const name = 'password';
        this.setState({ password },
            () => { this.validateField(name, password) })
    };

    handleChangeInputCodeCheck = async event => {
        const randomCode = event.target.value;
        this.setState({ randomCode })
    };
    handleOpen = async () => {
        this.setState({ modalOpen: true });
        const { email, username, password, randomCode } = this.state;
        const payload = { email, username, password, randomCode};

        await api.createUser(payload).then(res => {
            window.alert(`На указанный email отправлено письмо с кодом подтверждения`);
            this.setState({
                email: '',
                username: '',
                password: '',
                randomCode: '',
            })
        })
    };
    handleClose = () => this.setState({ modalOpen: false });

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    handleIncludeUser = async () => {
        const { email, username, password, randomCode } = this.state;
        const payload = { email, username, password, randomCode};

        await api.createUser(payload).then(res => {
            window.alert(`Пользователь успешно создан`);
            this.setState({
                email: '',
                username: '',
                password: '',
                randomCode: '',
            });
            this.props.history.push("/login");
        }).catch(error => {
                window.alert(`Пользователь не создан`)
        })
    };

    render() {
        return (
            <Form>
                <h2>Регистрация</h2>
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                    <label htmlFor="email">Email</label>
                    <input type="email" required className="form-control" name="email"
                           placeholder="Email"
                           value={this.state.email}
                           onChange={this.handleChangeInputEmail}  />
                </div>
                <div>
                    <label htmlFor="username">Имя пользователя</label>
                    <input type="username" required className="form-control" name="username"
                           placeholder="Имя пользователя"
                           value={this.state.username}
                           onChange={this.handleChangeInputUsername}  />
                </div>
                <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" className="form-control" name="password"
                           placeholder="Пароль"
                           value={this.state.password}
                           onChange={this.handleChangeInputPassword}  />
                </div>

                <Modal
                    trigger={<button className="btn btn-primary" onClick={this.handleOpen}>Отправить код</button>}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    basic
                >
                    <Modal.Content>
                        <label htmlFor="randomCode">Проверка кода</label>
                        <input type="randomCode" required className="form-control" name="randomCode"
                               placeholder="Проверка кода"
                               value={this.state.randomCode}
                               onChange={this.handleChangeInputCodeCheck}  />
                    </Modal.Content>
                    <Modal.Actions>
                        <button type="submit" className="btn btn-primary" onClick={this.handleIncludeUser}>Зарегистрироваться</button>
                    </Modal.Actions>
                </Modal>
                <a className="btn btn-primary" href={'/'}>Отмена</a>
            </Form>
        )
    }
}

export default Registration