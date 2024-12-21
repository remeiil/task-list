const taskName = document.getElementById("add-task");
const taskDuration = document.getElementById("task-duration");
const submitTask = document.getElementById("submit-task");
const toDoList = document.getElementById("to-do-list");
const callResponse = document.getElementById("call-response");

getTasks(); //loads the tasks onto the page initially

async function getTasks() {
    const res = await fetch('/getTasks', 
    {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    const data = await res.json()
    let taskArray = [];
    let taskOutput = "";
    for (let i = 0; i < data.tasks.length; i++){
        taskArray.push({taskID: data.tasks[i].taskID, taskName: data.tasks[i].taskName, taskDuration: data.tasks[i].taskDuration})//pretty sure I'm over workign this
    }
    taskArray.forEach(createTaskList);
    function createTaskList(tasks) {
        taskOutput += `<li>${tasks.taskName} - ${tasks.taskDuration}<button id="${tasks.taskID}">X</button></li>`;
    }
    toDoList.innerHTML = taskOutput;
}
submitTask.addEventListener('click', postTask)
async function postTask(e) {
    e.preventDefault();
    var formData = {
        taskName: taskName.value,
        taskDuration: taskDuration.value,
    };
    const res = await fetch('/postTask', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    const data = await res.json()
    callResponse.innerHTML += `<p class="responseMessage">Success: ${data.message}</p>`;
    setTimeout(function clearResponseMessage(){
        callResponse.innerHTML = "";
    }, 5000);
    clearInputFields()
    getTasks()
}
function clearInputFields() {
    taskName.value = ""
    taskDuration.value = ""
}

toDoList.addEventListener('click', deleteTask); //this is picking up every button so there is a better way to do it
async function deleteTask(e) {
    e.preventDefault();
    
    const taskID = e.target.id;
    const res = await fetch(`/deleteTask?id=${taskID}`, 
        {
            method: 'DELETE',
        })
    const data = await res.json()
    callResponse.innerHTML += `<p class="responseMessage">${data.Message}</p>`;
    setTimeout(function clearResponseMessage(){
        callResponse.innerHTML = "";
    }, 8000);
    getTasks()
}



