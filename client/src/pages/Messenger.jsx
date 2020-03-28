import React, { Component } from 'react'
import styled from "styled-components";

const Form = styled.div.attrs({
    className: 'Form',
})`
    width: 500px; 
    margin: auto;
    margin-top:70px;
`;
class Messenger extends Component {
    render() {
        return (
            <Form>
                <h1>Типо мессенджер</h1>
            </Form>
        )
    }
}

export default Messenger