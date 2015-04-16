
var fs = require('fs'),
	_ = require('underscore'),
	clc = require('cli-color'),
	taskEngine = require('taskengine')(),
	command = process.argv[2],
	passedData = process.argv[3];

var init = function init() {

	taskEngine.init(function() {
		executeCommands();
		exit();
	});
};

var executeCommands = function executeCommands() {
	if(!command) {
		listAllTasks(passedData);
		return;
	}

	switch( command.toLowerCase() ) {
		case "ls":
			listAllTasks(passedData);
			break;

		case "add":
		case "a":
			displayTask( taskEngine.addTask(passedData, process.argv[4]) );
			break;

		case "rm":
			displayTask( taskEngine.removeTask(passedData) );
			break;

		case "x":
		case "close":
			displayTask( taskEngine.closeTask(passedData) );
			break;

		case "edit":
			var editedTask = taskEngine.editTask(passedData, process.argv[4]);

			if(editedTask) {
				displayTask( editedTask );
			}
			else {
				console.log('No task found with that ID');
			}
			break;

		case "move":
			taskEngine.moveTask();
			break;

		default:
			listAllTasks(passedData);
			break;
	}
};

var listAllTasks = function listAllTasks(passedArgs) {
	var options = {collection: taskEngine.tasks};

	if(passedArgs == "a" || passedArgs == "all") {
		options.all = true;
	}
	else if(parseInt(passedArgs, 10) > -1) {
		options.taskID = parseInt(passedArgs, 10);
	}

	displayTasks(options);
};

/**
 * Called before exiting the program
 *
 * @return {undefined}
 */
var exit = function exit() {
	taskEngine.close();
};


/**
 * Display all tasks
 *
 * @return {undefined}
 */
var displayTasks = function displayTasks(options) {
	
	var taskList,
		returnAll = options.all,
		taskID = options.taskID,
		tasksCollection = options.collection;

	if(returnAll) {
		taskList = tasksCollection;

		for(var i=0; i<taskList.length; i++) {
			var task = taskList[i];
			displayTask(task);
		}
	}
	else if(taskID !== undefined) {
		taskList = taskEngine.getTaskByID( taskID );

		if(taskList) {
			process.stdout.write(clc.redBright("\n" + "[" + taskList.id + "] - " +taskList.name + "\n\n") );
			taskList = taskList.subTasks;
		}
		else {
			taskList = [];
		}

		for(var i=0; i<taskList.length; i++) {
			var taskID = taskList[i];
			var task = taskEngine.getTaskByID(taskID);
			task && displayTask(task);
		}
	}
	else {
		taskList = _.where(tasksCollection, {open: true, subTask: false});

		for(var i=0; i<taskList.length; i++) {
			var task = taskList[i];
			displayTask(task);
		}
	}

};

/**
 * Get a single task
 *
 * @param {object} task
 * @return {undefined}
 */
var displayTask = function displayTask(task) {
	var openClosed = "",
		subTasksExist = false;

	if(task.subTasks.length > 0) {
		subTasksExist = true;
	}

	// if the task is closed, don't print details
	if(!task.open) {
		openClosed = "×";
		console.log(clc.blackBright.strike(openClosed + "  " + task.id + " - " + task.name));
	}
	else {
		process.stdout.write(clc.blackBright("  [" + task.id + "]" + " - ") + clc.cyan.underline(task.name) );
		task.dueDate && process.stdout.write( clc.redBright("	(" + task.dueDate + ")"));
		subTasksExist && process.stdout.write( clc.cyan(" [+]"));
		process.stdout.write("\n");

		task.description && process.stdout.write(clc.blackBright("	" + task.description) + "\n");
	}
	process.stdout.write("\n");
};

// Start the program
init();
