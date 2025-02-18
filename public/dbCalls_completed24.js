const taskName = document.getElementById("add-task");
const taskDuration = document.getElementById("task-duration");
const submitTask = document.getElementById("submit-task");
const toDoList = document.getElementById("to-do-list");
const callResponse = document.getElementById("call-response");

getTasks(); //loads the tasks onto the page initially

async function getTasks() {
    const res = await fetch('/getCompletedTasks', 
    {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    const data = await res.json()
    let taskArray = [];
    let taskOutput = "";
    let l = data.tasks.length;
    for (let i = 0; i < l; i++){
        taskArray.push({taskID: data.tasks[i].taskID, taskName: data.tasks[i].taskName, taskDuration: data.tasks[i].taskDuration, createdTime: data.tasks[i].createdTime, completedTime: data.tasks[i].completedTime})//pretty sure I'm over workign this
    }
    taskArray.forEach(createTaskList);
    function createTaskList(tasks) {
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const prettyDay = ["Zenith","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"];
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        let dbTime = new Date(tasks.createdTime);
        let completedDBTime = new Date(tasks.completedTime);
        let weekdayName = weekday[dbTime.getDay()];
        let date = prettyDay[dbTime.getDate()];
        let monthName = month[dbTime.getMonth()];
        let year = dbTime.getFullYear();
        let completedWeekdayName = weekday[completedDBTime.getDay()];
        let completedDate = prettyDay[completedDBTime.getDate()];
        let completedMonthName = month[completedDBTime.getMonth()];
        let completedYear = completedDBTime.getFullYear();
        let twentyFourHoursAgo = Date.now() - 86400000;
        if (tasks.completedTime > twentyFourHoursAgo) {
            taskOutput += `<li>${tasks.taskName} <br><span class="time">Estimated as: ${tasks.taskDuration} </span><br><span class="date">Created: ${weekdayName} ${date} ${monthName} ${year}</span><br><span class="date">Completed: ${completedWeekdayName} ${completedDate} ${completedMonthName} ${completedYear}</span><button id="${tasks.taskID}">Remove from DB</button></li>`;
        }
        else {
            
        }
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



