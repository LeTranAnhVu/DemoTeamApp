var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost:27017/teamApp_V1', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let projectSchema = new mongoose.Schema({
    name: String,
    listMember: [{
        type: mongoose.Schema.ObjectId,
        ref: "Employee"

    }]
});
let Project = mongoose.model('Project', projectSchema);

let employeeSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    project: [{
        type: mongoose.Schema.ObjectId,
        ref: "Project"
    }]
});
let Employee = mongoose.model('Employee', employeeSchema);



Employee.find((err, allEmployees) => {
    if (err) {
        console.log(err);

    }
    else {
        allEmployees.forEach((employee) => {
            Employee.deleteOne({ _id: employee._id }, (err) => {
                if (err) {
                    console.log(err);
                }

            });
        });
    }
});




Project.find((err, allProjects) => {
    if (err) {
        console.log(err);
    }
    else {
        allProjects.forEach((project) => {
            Project.deleteOne({ _id: project._id }, (err) => {
                if (err) {
                    console.log(err);

                }

            });
        });
    }
});




let employees = [{
        name: "nguyen van D",
        phoneNumber: "094523321"
    },
    {
        name: "Le thi B",
        phoneNumber: "048387323"
    },
    {
        name: "Tran van C",
        phoneNumber: "0125436332"
    }
];
employees.forEach((employee) => {
    Employee.create(employee, (err, newE) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(newE);
        }
    });
})

let projects = [{
        name: 'project A'
    },
    {
        name: 'project B'
    },
    {
        name: 'project C'
    },

];

projects.forEach((project) => {
    Project.create(project, (err, newP) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(newP);
        }
    });
});



//projects
app.get('/api/projects', (req, res) => {
    Project.find((err, allProjects) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(allProjects);
        }
    });
});
app.post('/api/projects', (req, res) => {
    let newProject = req.body.newProject;
    Project.create(newProject, (err, newProject) => {
        if (err) {
            console.log(err);
            res.json({ err });
        }
        Project.find((err, allProjects) => {
            if (err) {
                console.log(err);
                res.json({ err });
            }
            else {
                res.json(allProjects);
            }
        });
    });
});
//show
app.get('/api/projects/:id', (req, res) => {
    let id = req.params.id;
    Project.findById(id).populate('listMember').exec((err, foundProject) => {
        if (err) {
            console.log(err);
            res.json({ err });
        }
        else {
            res.json(foundProject);
        }
    });
});
//assign member for project
app.put('/api/projects/:id/assign', (req, res) => {
    let projectId = req.params.id;
    let memberIds = req.body.memberIds;
    Project.findById(projectId, (err, foundProject) => {
        if (err) {
            console.log(err);
            res.json({ err: err });
        }
        else {
            memberIds.forEach((memberId) => {
                //update member id to project
                foundProject.listMember.push(memberId);
                //update project that this member is work for
                Employee.findById(memberId, (err, foundMember) => {
                    if (err) {
                        console.log(err);
                        res.json({ err })
                    }
                    else {
                        foundMember.project.push(foundProject._id);
                        foundMember.save();
                    }
                })
            })
            foundProject.save((err) => {
                if (err) {
                    console.log(err);
                    res.json({ err })
                }
                else {
                    res.json({ foundProject });
                }
            });

        }
    });
});



//unassign 
app.put('/api/projects/:id/unassign', (req, res) => {
    let unassignMemberId = req.body.unassignMemberId;
    let projectId = req.params.id;
    console.log(unassignMemberId);
    Project.findById(projectId, (err, foundProject) => {
        if (err || foundProject == null) {
            console.log(err);
            res.json(err);
        }
        else {
            let newList = foundProject.listMember.filter(memberId => {
                return memberId != unassignMemberId;
            });
            foundProject.listMember = newList;
            foundProject.save((err) => {
                if (err) {
                    console.log(err);
                    res.json({ err })
                }
                else {
                    res.json({ foundProject });
                }
            });
        }
    });

})


// employees
app.get('/api/employees', (req, res) => {
    Employee.find().populate('project').exec((err, allEmployees) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(allEmployees);
        }
    });
});

app.post('/api/employees', (req, res) => {
    let newEmployee = req.body.newEmployee;
    Employee.create(newEmployee, (err, newEmployee) => {
        if (err) {
            console.log(err);
            res.json({ err });
        }
        else {
            Employee.find().populate('project').exec((err, allEmployees) => {
                if (err) {
                    console.log(err);
                    res.json({ err });
                }
                else {
                    res.json(allEmployees);
                }
            });

        }
    })
});




app.get('*', (req, res) => {
    res.send('Oops! Page is not found.');
});

app.listen(8081, process.env.IP, () => {
    console.log('Project Management Server is running');
});
