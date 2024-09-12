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
//   "completed" : "boolean",
//   "added_date" : "string",
//   "tags" : "string"    personal/work 
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
    loadTodos();
    var task = {
      task : task,
      completed : false,
      added_date : new Date().toISOString(),
      priority : op.priority || 'medium',
      tags : op.tag || 'general',
      due_date : op.completeBy || null
    }
    todos.push(task);
    console.log(chalk.green(`Task added: ${task.task}`));
    saveTodos(todos);
  });

// List command
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
      const status = todo.completed ? chalk.green('✓') : chalk.red('✗');
      console.log(`${index + 1}. ${todo.task} [${status}]`);
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
  .action((index, op) => {
    console.log(index);
    loadTodos();
    if (index > 0 && index <= todos.length) {
      item  = todos[index];
      console.log(item);
      item.tags = op.tags;
      item.task = op.task;
      item.priority = op.priority;
      todos[index] = item;
      saveTodos(todos);
    }
    else {
      console.log(chalk.red('No tasks found at entered index'))
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
