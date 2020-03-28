import React, { Component } from 'react'
import api from '../api'
import styled from "styled-components";

const Form = styled.div.attrs({
    className: 'Form',
})`
    width: 500px; 
    margin: auto;
    margin-top:70px;
`;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }
    }

    handleChangeInputEmail = async event => {
        const email = event.target.value;
        this.setState({ email })
    };

    handleChangeInputPassword = async event => {
        const password = event.target.value;
        this.setState({ password })
    };

    handleIncludeUser = async () => {
        const { email, password } = this.state;
        const payload = { email, password};

        await api.login(payload).then(res => {
            window.alert(`Вы успешно авторизовались`);
            this.setState({
                email: '',
                password: '',
                })
            this.props.history.push("/mes");
            })
            .catch(error => {
                window.alert(`Email или пароль не верны`)
            })
    };

    render() {
        return (
            <Form>
                <h2>Авторизация</h2>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" required className="form-control" name="email"
                           placeholder="Email"
                           value={this.state.email}
                           onChange={this.handleChangeInputEmail}  />
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" className="form-control" name="password"
                           placeholder="Пароль"
                           value={this.state.password}
                           onChange={this.handleChangeInputPassword}  />
                </div>
                <br/>
                <button type="submit" className="btn btn-primary" onClick={this.handleIncludeUser}>Вход</button>
                <a className="btn btn-primary" href={'/'}>Отмена</a>
            </Form>
        )
    }
}

export default Login