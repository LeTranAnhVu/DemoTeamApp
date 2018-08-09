import React from "react";
var axios = require('axios');
import TableComponent from "./table";
import { List, Button, Divider, Header, Segment } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { project: {} };

        this.getData = this.getData.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        //collase implementation
        this.collapeHandler = this.collapeHandler.bind(this);
        this.updateAssignList = this.updateAssignList.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.state = { isCollapsed: false };

    }
    getData(id) {
        return axios.get(`/api/projects/${id}`)
            .then(res => {
                const project = res.data;
                this.setState({ project });
            });
    }
    async onUpdate() {
        await this.getData(this.props.match.params.id);
        //reset the state
        this.state.isCollapsed = false;
        this.updateAssignList();
    }

    collapeHandler() {
        //check whether table employees is collapsed or not
        let isCollapsed = this.state.isCollapsed;
        if (!isCollapsed) {
            //show the list
            this.updateAssignList();
        }
        else {
            //pop off the list
            this.setState({ listOfAssignment: null });
        }
        //toggle the state collaped
        this.setState({ isCollapsed: (!isCollapsed) });
    }
    updateAssignList() {
        let listOfAssignment = <AssignList project={this.state.project} onUpdate={this.onUpdate}/>;
        this.setState({ listOfAssignment: listOfAssignment });
        return listOfAssignment;
    }

    //unassign member 
    async onRemove(unassignMember) {
        console.log("removed", unassignMember);
        let unassignMemberId = unassignMember.id;
        console.log("unassignMemberId", unassignMemberId);
        let projectId = this.state.project._id;
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            await axios.put(`/api/projects/${projectId}/unassign`, { unassignMemberId }, headers);
        }
        catch (err) {
            console.log(err);
        }

        //
        this.onUpdate();
    }

    componentDidMount() {
        this.getData(this.props.match.params.id);
    }

    render() {
        if (this.state.project) {
            let columns = ["id", "Name", "Phone number"];
            let rowData = this.state.project.listMember.map((member) => {
                return {
                    "id": member._id,
                    "Name": member.name,
                    "Phone number": member.phoneNumber
                };
            });
            let tableData = {
                columns: columns,
                rows: rowData
            };
            let handleStaff = [{
                handlerName: 'Unassign',
                handler: this.onRemove
            }];
            return (
                <div>
                <h1>{this.state.project.name}</h1>
                <TableComponent  listOfHandler={handleStaff} data={tableData} notShowColumns={['id']} />
                <Header as='h3' dividing  onClick={this.collapeHandler}>Assign</Header>
                <Segment.Group stacked>
                    {this.state.listOfAssignment}
                </Segment.Group>
                <div>
                    <Link to={"/"}>Home</Link>
                </div>
           </div>
            );
        }
        else {
            return (
                <div>
            </div>
            );
        }
    }
}



class AssignList extends React.Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        this.updateList = this.updateList.bind(this);
        this.commitAssign = this.commitAssign.bind(this);
        this.state = { employees: [], assignedList: [] };
        this.findUnassignEmployees = this.findUnassignEmployees.bind(this);
        this.showList = this.showList.bind(this);

    }

    getData() {
        return axios.get(`/api/employees`)
            .then(res => {
                const employees = res.data;
                // console.log(employees);
                this.setState({ employees });
                // console.log(this.state.employees);
            });
    }


    updateList(id) {
        this.state.assignedList.push(id);
        // console.log("from updateList:  ");
        // console.log(this.state.assignedList);
    }

    commitAssign() {
        let memberIds = this.state.assignedList;
        // update the data
        const headers = {
            'Content-Type': 'application/json',
        };
        axios.put(`/api/projects/${this.props.project._id}/assign`, { memberIds }, headers)
            .then((res) => {
                this.state.assignedList = [];
                this.props.onUpdate();
            }).catch(err => console.log(err));
    }
    findUnassignEmployees() {
        let members = this.props.project.listMember;
        let isAssignList = {};
        members.forEach((member) => {
            isAssignList[member._id] = true;
        });
        let allEmployees = this.state.employees;
        let unassignEmployees = allEmployees.filter((employee) => {
            if (isAssignList[employee._id] != true) {
                return employee;
            }
        });
        // console.log(unassignEmployees);
        return unassignEmployees;
    }
    showList() {
        let unassignEmployees = this.findUnassignEmployees();
        let e = (unassignEmployees.length == 0 && this.props.project.listMember.length != 0) ? <div>All employees are assigned in this project</div> :
            <List selection verticalAlign='middle'>{
                unassignEmployees.map((employee)=>{
                    return <AssignEmployee key={employee._id} employee={employee} updateList={this.updateList}/>;
                })
            }
            </List>;
        return e;
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <div>
                { this.showList()}
                <Button primary onClick={this.commitAssign}>Assign</Button>
            </div>
        );
    }
}

class AssignEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.chooseHandler = this.chooseHandler.bind(this);
        this.state = {
            choosedList: {}
        };
    }


    chooseHandler(id) {
        // let employee =this.props.employee._id;
        if (!this.state.choosedList[id]) {
            this.state.choosedList[id] = { color: "green", textDecoration: "line-through" };
            this.props.updateList(id);
        }
        else {
            this.state.choosedList[id] = null;
        }

        this.forceUpdate();
    }

    render() {
        let employee = this.props.employee;
        let setColor;
        let textDecoration;
        if (!this.state.choosedList[employee._id]) {
            setColor = "black";
        }
        else {
            setColor = this.state.choosedList[employee._id].color;
            textDecoration = this.state.choosedList[employee._id].textDecoration;
        }

        return (
            <List.Item><List.Content style={{color: setColor , textDecoration: textDecoration}} onClick={()=>{this.chooseHandler(this.props.employee._id)}}> {this.props.employee.name}</List.Content></List.Item>
        );
    }
}




module.exports = ProjectDetail;
