import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Home, Registration, Login, Messenger } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/registration" exact component={Registration} />
                <Route path="/login" exact component={Login} />
                <Route path="/mes" exact component={Messenger} />
            </Switch>
        </Router>
    )
}

export default App

