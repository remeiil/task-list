import { DB } from './dbconnector.js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/getTasks', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM tasks';
    let data = {tasks: []};
    try {
        DB.all(sql, [], (error, rows) =>{
            if (error) {
                throw error;
            }
            rows.forEach(row => {
                data.tasks.push({taskID: row.task_id, taskName: row.task_name, taskDuration: row.task_duration});
            });
            let content = JSON.stringify(data);
            res.status(200).send(content);
        })
    } catch (error) {
        console.log(error.message);
        res.status(800).send(`{"Code": 800, "Status": "${error.message}", "Description":"There was an error when trying to get a list of existing tasks."}`)
    }
});

app.post('/postTask', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO tasks(task_name, task_duration) VALUES(? , ?)';
    try {
        DB.run(sql, [req.body.taskName, req.body.taskDuration], function(error){
            if (error) throw error;
            res.status(201);
            let data = { status: 201, message: `${req.body.taskName} saved to tasks table.`};
            let content = JSON.stringify(data);
            res.send(content);
        })
    } catch (error) {
        console.log(error.message);
        res.status(801).send(`{"Code": 801, "Status": "${error.message}", "Description":"There was an error when trying to create the new task."}`)
    }
})
app.delete('/deleteTask', (req, res) =>{
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM tasks WHERE task_id = ? ;';
    try {
        DB.run(sql, [req.query.id], function(error){
            if (error) throw error;
            if (this.changes === 1){
                res.status(200);
                res.send(`{"Message":"Task ID#${req.query.id} was successfully removed from tasks table."}`);
            } else {
                res.status(200);
                res.send(`{"Message":"No action taken"}`);
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(802).send(`{"Code": 802, "Status": "${error.message}", "Description":"There was an error when trying to delete the task."}`)
    }
})

app.listen(port, (err) => {
    if(err) {
        console.log('ERROR:', err.message);
    }
    console.log('LISTENING on port ' + port)
})