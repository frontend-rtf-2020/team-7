import React, { Component } from 'react'
import styled from "styled-components";

const Form = styled.div.attrs({
    className: 'Form',
})`
    width: 500px; 
    margin: auto;
    margin-top:70px;
`;
class Home extends Component {
    render() {
        return (
            <Form>
                <h1>Начальная страница</h1>
                <a className="btn btn-primary" href={'/registration'}>Регистрация</a>
                <a className="btn btn-primary" href={'/login'}>Авторизация</a>
            </Form>
        )
    }
}

export default Home