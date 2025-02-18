import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();
const DB = new sql3.Database('todo.db', sqlite3.OPEN_READWRITE, connect);

function connect(err){
    if (err) {
        console.log(err.message);
        return;
    }
    console.log('Connecting to To Do database...');
}

let sqlStatement = `CREATE TABLE IF NOT EXISTS tasks (task_id INTEGER PRIMARY KEY, task_name TEXT NOT NULL, task_duration TEXT NOT NULL, task_status TEXT, created_time datetime, completed_time datetime);`;
DB.run(sqlStatement, [], (err) => {
    if (err) {
        console.log('There was an error creating the tasks table.');
        return;
    }
    console.log('Connection to todo.db established and awaiting further instructions...');
});

export {DB};