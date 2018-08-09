import React from "react";
var axios = require('axios');
import { Segment, Grid, Form, Header, Button,List , Menu } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isShowedForm: true
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.getData = this.getData.bind(this);
        this.onToggleForm = this.onToggleForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    async onSubmit(newProject) {
        try {
            await axios.post(`/api/projects`, { newProject });
            this.getData();
        }
        catch (err) {
            console.log(err);
        }
    }

    getData() {
        return axios.get(`/api/projects`)
            .then(res => {
                const projects = res.data;
                // console.log(projects);
                this.setState({ projects });
                // console.log(this.state.projects);
            }).catch(err => { console.log(err) });
    }
    onToggleForm() {
        //toggle the state
        this.setState({ isShowedForm: !this.state.isShowedForm });
    }
    renderForm() {
        let isShowed = this.state.isShowedForm;
        return (!isShowed) ? <AddNew onSubmit={this.onSubmit}/> : <div></div>;
    }

    async componentDidMount() {
        await this.getData();
    }
    render() {
        return (
            <div>
             <Menu secondary vertical>
                {
                    this.state.projects.map((project,i)=>{
                        return (<Menu.Item key={project._id}
                                    as={Link} to={`/projects/${project._id}`}> {project.name} 
                               </Menu.Item>);
                    })
                }
            </Menu>
            <div>
                    <Header as='h3' onClick={this.onToggleForm}>New Project</Header>
                    {this.renderForm()}
            </div>
            <div>
                <Link to={"/"}>Home</Link>
            </div>
       </div>
        );
    }
}


class AddNew extends React.Component {
    constructor(props) {
        super(props);
        this.submitHander = this.submitHander.bind(this);
    }
    render() {
        return (
            <Form onSubmit={this.submitHander}>
                <Form.Field>
                    <label>Project Name</label>
                    <input type="text" ref="name" required />
                </Form.Field>
                <Button type='submit'>Add</Button>
            </Form>
        );
    }
    submitHander(e) {
        e.preventDefault();
        // console.log(this.refs.addedTask);
        let newProject = { name: this.refs.name.value };
        // console.log(newProject);
        this.props.onSubmit(newProject);
    }

}

module.exports = Projects;
