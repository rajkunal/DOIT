### This is a ToDo application which can be used via CLI 

#### To install
  npm i -g chore.do 

#### Commands
  add [options] <task>    Add a new task    
  list [options]          List all tasks    
  remove <index>          Remove a task by index    
  remove-all              Remove all the tasks  
  edit [options] <index>  Remove a task by index    
  help [command]          display help for command  

#### Add a item to todo list
  doit add [options] <task-name>    
  -t, --tag <tag> - Tag for the task (e.g., work, personal, general)    
  -p, --priority <priority> - Priority of the task (e.g., low, medium, high)    
  -c, --completeBy <completeBy> - Completion date for the task  

#### Delete an item from todo list at a particular index
  doit remove <index>   

#### Delete complete todo list
  doit remove-all   

#### List all todo items
  doit list [options]   
  -f, --filter <tag> - Filter tasks based on a certain tag (e.g., work, personal, general)  

#### Edit a todo item at a particular index
  doit edit [options] <index>   
  -t, --tags <new tag>  - Edit the tag  
  -task, --task <new task> - Edit the task  
  -p, --priority <priority> - Edit the priority 
  -c, --complete <index> - Edit task status by index    
  -d, --date <index> - Edit due date for a task by index (mm/dd/yyyy)   
