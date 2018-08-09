import React from "react";
var axios = require('axios');
import TableComponent from "./table";
import { Button, Form , Header} from 'semantic-ui-react';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            isShowedForm: true
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.getData = this.getData.bind(this);
        this.onToggleForm = this.onToggleForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    async onSubmit(newEmployee) {
        try {
            await axios.post(`/api/employees`, { newEmployee });
            this.getData();
        }
        catch (err) {
            console.log(err);
        }

    }

    getData() {
        return axios.get(`/api/employees`)
            .then(res => {
                // console.log("fetched");
                const employees = res.data;
                // console.log("employees",employees);
                this.setState({ employees });
                // console.log(this.state.employees);
            });
    }
    async componentDidMount() {
        try{
            await this.getData();
        }catch(err){
            console.log(err);
        }
        
    }
    onToggleForm(){
        //toggle the state
        this.setState({isShowedForm: !this.state.isShowedForm});
    }
    renderForm(){
        let isShowed = this.state.isShowedForm;
        
        return (!isShowed)? <AddNew onSubmit={this.onSubmit}/> : <div></div>
    }


    render() {
        if (this.state.employees) {
            let rowData = this.state.employees.map((employee) => {
                return {
                    'Name': employee.name,
                    'Phone number': employee.phoneNumber,
                    'Project': employee.project.map((pro) => {
                        return pro.name;
                    })
                }
            });
            let columns = ['Name', 'Phone number', 'Project'];
            let tableData = {
                columns: columns,
                rows: rowData
            }
            return (
                <div>
                <TableComponent data = {tableData} />
                <div>
                    <Header as='h2' onClick={this.onToggleForm}>New Employee</Header>
                    {this.renderForm()}
                </div>
                <div>
                    <Link to={"/"}>Home</Link>
                </div>
           </div>
            )
        }
        else {
            return (<div></div>);
        }
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
                    <label>Employee Name</label>
                    <input type="text" ref="name" required />
                </Form.Field>
                <Form.Field>
                    <label>Phone Number</label>
                    <input type="text" ref="phoneNumber" required />
                </Form.Field>
                <Button type='submit'>Add</Button>
            </Form>
        );
    }


    // custome function 
    submitHander(e) {
        e.preventDefault();
        let newEmployee = {
            name: this.refs.name.value,
            phoneNumber: this.refs.phoneNumber.value
        };
        this.props.onSubmit(newEmployee);
    }

}

module.exports = Employees;
