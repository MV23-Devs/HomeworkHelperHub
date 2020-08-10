import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Route, 
    Switch, 
    Link
} from 'react-router-dom'
import Profile from './screens/Profile.jsx'
import Home from './screens/Home.jsx'


export default class AppRouter extends Component{
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <Home/>
                    </Route>
                    <Route path='/profile'>
                        <Profile/>
                    </Route>
                </Switch>
            </Router>
        )
    }
}