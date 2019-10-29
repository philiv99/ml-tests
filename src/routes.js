import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Settings from './pages/Settings/Settings'
import NoPage from './pages/NoPage/NoPage'
import Training from './pages/Training/Training'
import React from 'react';

const routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/about" component={About}></Route>
            <Route exact path="/settings" component={Settings}></Route>
            <Route exact path="/train" component={Training}></Route>
            <Route exact path="*" component={NoPage}></Route>
        </Switch>
    </BrowserRouter>
);

export default routes;