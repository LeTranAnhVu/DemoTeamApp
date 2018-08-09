var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios');
// import '!style-loader!css-loader!semantic-ui-css/semantic.min.css';
// import {Button } from 'semantic-ui-css/semantic.min.js';
import { Segment, Button, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/semantic.js';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";


import Employees from "../components/employee";
import Projects from "../components/project";
import ProjectDetail from "../components/projectDetail";
// import MemberInfo from "../components/memberInfo";
// import AddTask from "../components/addTask";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={"/projects/:id"} component={ProjectDetail} />
                    <Route path={"/projects"} component={Projects} />
                    <Route path={"/employees"} component={Employees} />
                    <Route path={"/"} component={TeamApp} />
                </Switch>
            </BrowserRouter>
        );
    }
}

class TeamApp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div width="50%">
            <Segment padded>
                  <Button basic color='black' fluid as={Link} to='/employees'>Employees</Button>
                <Divider horizontal>Or</Divider>
                  <Button basic color='black' fluid as={Link} to='/projects'>Projects</Button>
              </Segment>
            </div>

        );
    }
}




ReactDOM.render(<App />, document.getElementById('root'));
