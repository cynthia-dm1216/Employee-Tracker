var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Martinez1216",
  database: "employee_tackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id' + connection.threadId + '\n');
  //start();
  runSearch();
});

function runSearch() {
  inquirer
  .prompt({
    type:"list",
    message:"What would you like to do?",
    name:"action",
    choices:[
      "Add Employee",
      "View all Employees",
      "Remove Employee",
      "Add Department",
      "View all Departments",
      "Add Roles",
      "View all Roles",
      "Update Employee Role",
      "Exit"
    ]
  }).then (function(answer,action) {
  
    console.log("after first inquirere prompt, answer,action " + JSON.stringify(answer,action));
    switch(answer.action) {
    case "Add Employee":
    addEmployee();
    break;

    case "View all Employees":
    viewAllEmployees();
    break;

    case "Remove Employee":
    removeEmployee();
    break;
    
    case "Add Department":
    addDept();
    break;

    case "View all Departments":
    viewAllDept();
    break;

    case "Add Roles":
    addRole();
    break;

    case "View all Roles":
    viewAllRoles();
    break;

    case "Update Employee Role":
    updateEmployeeRole();
    break;

    case "Exit":
    connection.end();
    break;
    }
  });
}

function addEmployee() {
  console.log('Inserting a new employee. \n');
  inquirer
  .prompt([
    {
      type:"input",
      message: "Enter First Name",
      name:"first_name" 
    },
    {
      type:"input",
      message:"Enter Last Name",
      name:"last_name"
    },
    {
      type:"input",
      message:"What is the employees role?",
      name:"role_id",
      choices: [1,2,3]
    },
    {
      type:"input",
      message:"Who is the Manager?",
      name:"manager_id"
    },
  ])
  .then(function(answer){
    var query = connection.query(
      "INSERT INTO employees SET ?",
      answer,
      function(err,res) {
        if (err) throw err;
        console.log("Employee added!\n");
        runSearch();
      }
    );
    console.log(query.sql);
  })
}

function removeEmployee(){
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err,res) => {
      for (let i = 0; i < res.length; i++){
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
  inquirer 
  .prompt ([ 
    {
      type: "list", 
      message: "Which employee would you like to delete?",
      name: "employee",
      choices: employeeList

    },
  ])
  .then (function(res){
    const query = connection.query(
      `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "Employee deleted!\n");
      runSearch();
    });
    });
    }
      );
      };

function viewAllEmployees(){
  connection.query ("SELECT * FROM employees", function(err,res){
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function addDept(){
inquirer
.prompt([
  {
    type:"input",
    name:"deptName",
    message:"What Department would you like to add?"
  }
]).then(function(res){
  console.log(res);
  const query = connection.query("INSERT INTO department SET ?",
  {
    name: res.deptName
  },
  function(err,res){
    connection.query("SELECT * FROM department", function(err,res){
      console.table(res);
      runSearch();
    })
  })
})
}

function viewAllDept(){
connection.query("SELECT * FROM departmnet",function(err,res){
  console.table(res);
  runSearch();
});
}

function addRole(){
  let department = [];
  connection.query("SELECT * FROM department",function(err,res){
    if(err) throw err;
    for(let i = 0; i <res.length; i++){
      res[i].first_name + " " + res[i].last_name
      department.push({name:res[i].name,value: res[i].id});
    }
    inquirer
    .prompt([
      {
        type:"input",
        name:"title",
        message:"What role would you like to add?"
      },
      {
        type:"input",
        name:"salary",
        message:"What is the salary for the role?"
      },
      {
        type:"input",
        name:"department",
        message:"What type of department?",
        choices: department
      }
    ]).then (function(res){
      console.log(res);
    })
  })
}

function viewAllRoles(){
  connection.query("SELECT roles.*, department.name FROM roles LEFT JOIN department ON department.id = roles.department_id",
  function (err,res){
    if(err) throw err;
    console.table(res);
    runSearch();
  });
}

// function addRole(){
//   let department = [];
//   connection.query("SELECT * FROM department",function(err,res){
//     if(err) throw err;
//     for(let i = 0; i <res.length; i++){
//       res[i].first_name + " " + res[i].last_name
//       department.push({name:res[i].name,value: res[i].id});
//     }
function updateEmployeeRole(){
  connection.query("SELECT firs_name, last_name, id FROM employees", 
  function(err,res){
      for (let i=0; i <res.length; i++){
    employees.push({employees:res[i].first_name,employees:res[i].last_name,value:res[i].id});
  }
    //let employees = res.map(employees => ({name: employees.first_name + " " + employees.last_name, values:employees.id}))
    inquirer
    .prompt([
      {
        type:"list",
        name:"employeesName",
        message:"Which employee role would you like to update?",
        choices: employees
      },
      {
        type:"input",
        name:"role",
        message:"What is the new role for the employee?"
      }
    ]).then (function(res){
      connection.query(`UPDATE employees SET role_id = ${res.role} WHERE id = ${res.employeesName}`,
      function(err, res){
        console.log(res);
        runSearch();
      });
    })
  })
}
