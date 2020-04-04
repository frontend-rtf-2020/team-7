import React, { Component } from 'react'
import styled from "styled-components";
import api from "../api";

const Form = styled.div.attrs({
    className: 'Form',
})`
    width: 500px; 
    margin: auto;
    margin-top:70px;
`;

class Messenger extends Component {
    handleLogout = async () => {
        await api.logout().then(res => {
            this.props.history.push("/");
        })
    };

    render() {
        return (
            <Form>
                <h1>Типо мессенджер</h1>
                <button type="submit" className="btn btn-primary" onClick={this.handleLogout}>Выход</button>
            </Form>
        )
    }
}

export default Messenger