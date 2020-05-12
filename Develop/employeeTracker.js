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

connection.connect(function (err) {
  if (err) throw err;
  console.log('connected as id' + connection.threadId + '\n');
  //start();
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "Add Employee",
        "View all Employees",
        "Remove Employee",
        "Add Department",
        "Add Roles",
        "View all Roles",
        "Update Employee Role",
        "Exit"
      ]
    }).then(function (answer, action) {

      console.log("after first inquirere prompt, answer,action " + JSON.stringify(answer, action));
      switch (answer.action) {
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

        case "Remove Department":
          removeDept();
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
        type: "input",
        message: "Enter First Name",
        name: "first_name"
      },
      {
        type: "input",
        message: "Enter Last Name",
        name: "last_name"
      },
      {
        type: "list",
        message: "What is the employees role?",
        name: "role",
        choices: [
          'Doctor',
          'Intern',
          'Manager',
          'Lawyer',
          'Lead Engineer',
          'Salesperson',
          'None'
        ]
      },
      {
        type: "list",
        message: "Who is the Manager?",
        name: "manager",
        choices: [
          'Rodriguez',
          'Tavarez',
          'Wilson',
          'Flores',
          'None'
        ]
      },
    ])
   .then(function(answer) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answer.firstname,
        last_name: answer.lastname,
        role_id: answer.role,
        manager_id: answer.manager
      },
      function(err, answer) {
        if (err) {
          throw err;
        }
        console.table(answer);
      }
    );
    runSearch();
  });
}

function removeEmployee() {
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err, res) => {
      for (let i = 0; i < res.length; i++) {
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to delete?",
            name: "employee",
            choices: employeeList

          },
        ])
        .then(function (res) {
          const query = connection.query(
            `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
            function (err, res) {
              if (err) throw err;
              console.log("Employee deleted!\n");
              runSearch();
            });
        });
    }
  );
};

function viewAllEmployees() {
  connection.query("SELECT employees.first_name, employees.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    });
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What Department would you like to add?"
      }
    ]).then(function (res) {
      console.log(res);
      const query = connection.query("INSERT INTO department SET ?",
        {
          name: res.deptName
        },
        function (err, res) {
          connection.query("SELECT * FROM department", function (err, res) {
            console.table(res);
            runSearch();
          })
        })
    })
}
function removeDept() {
  return connection.query("DELETE FROM department WHERE name = ?");
}

function addRole() {
  let department = [];
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      res[i].first_name + " " + res[i].last_name
      department.push({ name: res[i].name, value: res[i].id });
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What role would you like to add?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for the role?"
        },
        {
          type: "list",
          name: "department",
          message: "What type of department?",
          choices: department
        }
      ]).then(function (res) {
        console.log(res);
        const query = connection.query(
          "INSERT INTO roles SET ?",
          {
            title: res.title,
            salary: res.salary,
            department_id: res.department
          },
          function (err, res) {
            if (err) throw err;
            runSearch();
          }
        )
      })
  })
}

function viewAllRoles() {
  connection.query("SELECT roles.*, department.name FROM roles LEFT JOIN department ON department.id = roles.department_id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    });
}


function updateEmployeeRole() {
 console.log("updating employee");
 let newEmp = [];
 connection.query("SELECT * FROM employees",function (err,answer){
  //  console.log(answer);
 for (let i = 0; i < answer.length; i++){
   let employeesString = answer[i].id + '' + answer[i].first_name 
   + '' + answer[i].last_name;
   newEmp.push(employeesString);
  //  console.log(newEmp);
 }
 inquirer
 .prompt([
   {
     type: "list",
     name: "updateEmpRole",
     message: "select employee to update role",
     choices: newEmp
   },
   {
     type: "list",
     message: "select new role",
     choices: ["manager", "employee"],
     name: "newrole"
   }
 ])
 .then(function(answer) {
   console.log("about to update", answer);
   const idToUpdate = {};
   idToUpdate.employeeId = parseInt(answer.updateEmpRole.split(" ")[0]);
   if (answer.newrole === "manager") {
     idToUpdate.role_id = 1;
   } else if (answer.newrole === "employee") {
     idToUpdate.role_id = 2;
   }
   connection.query(
     "UPDATE employee SET role_id = ? WHERE id = ?",
     [idToUpdate.role_id, idToUpdate.employeeId],
     function(err, data) {
       runSearch();
     }
   );
 });
 })
}
