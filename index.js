#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const todos = [];

// Task Structure
// {
//   "task" : "string",
//   "priority" : "string",
//   "due_date" : "string",
//   "done" : "boolean",
//   "added_date" : "string",
//   "tags" : "string"   
// }

const todosPath = path.join(require('os').homedir(), 'todos.json');

program
  .version('1.0.0')
  .description('CLI To-Do Application');

// Add command
program
  .command('add <task>')
  .description('Add a new task')
  .option('-t, --tag <tag>', 'Tag for the task (e.g., work, personal, general)')
  .option('-p, --priority <priority>', 'Priority of the task (e.g., low, medium, high)')
  .option('-c, --completeBy <completeBy>','Completion date for the task')
  .action((task , op) => {
    const options = { timeZone: 'Asia/Kolkata' }; // Putting IST timezone
    loadTodos();
    var task = {
      task : task,
      done : false,
      added_date : new Date().toLocaleDateString('en-US',options),
      priority : op.priority || 'medium',
      tags : op.tag || 'general',
      due_date : op.completeBy || null
    }
    todos.push(task);
    console.log(chalk.green(`Task added: ${task.task}`));
    saveTodos(todos);
  });

// List/Filtered list based on tags
program
  .command('list')
  .description('List all tasks')
  .option('-f, --filter <tag>', 'Filter tasks based on a certain tag (e.g., work, personal, general)')
  .action((op) => {
    loadTodos();
    todoList = todos.filter((item) => {
      return op.filter? item.tags == op.filter : true
    })
    if(todos.length == 0) {
      console.log(chalk.green("Yayy!! No tasks pending"));
      return;
    }
    todoList.forEach((todo, index) => {
      const status = todo.done ? chalk.green('✓') : chalk.red('✗');
      console.log(`${index + 1}. Task = ${chalk.blue(todo.task)} | priority = ${chalk.blue(todo.priority)} | createDate = ${chalk.blue(todo.added_date)} | tag = ${chalk.blue(todo.tags)} | last-date = ${chalk.blue(todo.due_date)} | status = [${status}]  `);
    });
  });

// Remove command
program
  .command('remove <index>')
  .description('Remove a task by index')
  .action((index) => {
    loadTodos();
    if (index > 0 && index <= todos.length) {
      const removed = todos.splice(index - 1, 1);
      console.log(chalk.red(`Task removed: ${removed[0].task}`));
      saveTodos(todos);
    } else {
      console.log(chalk.red('Invalid index'));
    }
  });

// Clear todos list
  program
  .command('remove-all')
  .description('Remove all the tasks')
  .action((index) => {
    loadTodos();
    if(todos.length == 0) {
      console.log(chalk.green("No tasks to remove"));
    }else {
      todos.length = 0;
      saveTodos(todos);
      console.log(chalk.red('All tasks cleared'));
    }
  });

// Edit todo at a particular index
  program
  .command('edit <index>')
  .description('Remove a task by index')
  .option('-t, --tags <new tag>','Edit the tag')
  .option('-task, --task <new task>', 'Edit the task')
  .option('-p, --priority <priority>' , 'Edit the priority')
  .option('-c, --complete <index>','Edit task status by index')
  .option('-d, --date <index>','Edit due date for a task by index (mm/dd/yyyy)')
  .action((index, op) => {
    loadTodos();
    if (index > 0 && index <= todos.length && ( op.tags || op.priority || op.task || op.complete || op.date)) {
      item  = todos[index-1];
      item.tags = op.tags ? op.tags : item.tags; 
      item.task = op.task ? op.task : item.task;
      item.priority = op.priority ? op.priority : item.priority;
      item.done = op.complete == undefined ? item.done : op.complete;
      item.due_date = op.date ? op.date : item.date;

      todos[index-1] = item;
      saveTodos(todos);
    }
    else {
      console.log((op.tags || op.priority || op.task || op.complete == undefined || op.date)? chalk.red('No tasks found at entered index') : chalk.red('Invalid action'));
    }
  });

// Save tasks to file
function saveTodos(todos) {
  fs.writeFileSync(todosPath, JSON.stringify(todos));
}

// Load tasks from file
function loadTodos() {
  if (fs.existsSync(todosPath)) {
    const data = fs.readFileSync(todosPath, 'utf-8');
    const loadedTodos = JSON.parse(data);
    todos.length = 0;
    todos.push(...loadedTodos);
  }
}


program.parse(process.argv);
