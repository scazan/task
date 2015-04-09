
var fs = require('fs'),
	_ = require('underscore'),
	taskFile = "REPLACEWITHLOCATIONOFYOURJSON/tasks.json",
	tasks,
	command = process.argv[2],
	passedData = process.argv[3],
	largestID = 0,
	defaultTask = {
		id: -1,
		open: true,
		name: "",
		sort: 0,
		description: "",
		url: "",
		dueDate: 0,
		scheduledDate: 0,
		dateAdded: 0,
		comments: "",
		subTasks: [],
	};

var init = function init() {
	fs.readFile(taskFile, 'utf8', readTasks);
};

var executeCommands = function executeCommands() {
	switch(command) {
		case "ls":
			listTasks();
			break;

		case "add":
			addTask();
			break;

		case "rm":
			removeTask();
			break;

		case "X":
			closeTask();
			break;

		default:
			listTasks();
			break;
	}
};

/**
 * Called before exiting the program
 *
 * @return {undefined}
 */
var exit = function exit() {
	writeTasks();
};

/**
 * Parse the tasks from a string and set the global tasks array
 *
 * @param err
 * @param {String} data
 * @return {undefined}
 */
var readTasks = function getTasks(err, data) {
	tasks = JSON.parse(data);

	var sortedTasks = _.sortBy(tasks, function(task) { return parseInt(task.id, 10); });
	largestID = sortedTasks[sortedTasks.length-1].id;

	executeCommands();
	exit();
};

/**
 * Write all tasks to the JSON file
 *
 * @return {undefined}
 */
var writeTasks = function writeTasks() {
	fs.writeFile(taskFile, JSON.stringify(tasks), function(){});
};

/**
 * List all tasks
 *
 * @return {undefined}
 */
var listTasks = function listTasks() {
	
	var taskList = tasks;

	if(passedData !== "a" && passedData !== "all") {
		taskList = _.where(tasks, {open: true});
	}

	for(var i=0; i<taskList.length; i++) {
		var task = taskList[i];
		listTask(task);
	}
};

/**
 * List a single task
 *
 * @param {object} task
 * @return {undefined}
 */
var listTask = function listTask(task) {
	var openClosed = "";

	if(!task.open) {
		openClosed = "×";
	}

	console.log(openClosed + "  " + task.id + " - " + task.name);
	task.description && console.log("	" + task.description);
	task.dueDate && console.log("	" + task.dueDate);
};

/**
 * Parse the "key: value" formatted input into an object
 *
 * @param {String} data The input string
 * @return {object} The parsed object
 */
var parseInputData = function parseInputData(data) {
	var params = data.split(","),
		parsedObject = {};

	for(var i=params.length-1; i >=0; i--) {
		var keyValue = params[i].split(":");

		parsedObject[ keyValue[0].split(' ').join('') ] = keyValue[1];
	}

	return parsedObject;

};

/**
 * Add the given task to our array
 *
 * @return {undefined}
 */
var addTask = function addTask() {
	if(passedData !== undefined) {
		var parsedData = parseInputData(passedData);

		var newTask = _.clone(defaultTask)
		_.extend(newTask, parsedData);

		newTask.dateAdded = Date.now();
		newTask.id = largestID + 1;

		tasks.unshift( newTask );
		console.log('Added:');
		listTask(newTask);
	}
	else {
		console.log('no task name given');
	}

};

var removeTask = function removeTask() {
	var taskID = parseInt(passedData, 10);
	var task = _.findWhere(tasks, {id: taskID});
	var taskIndex = tasks.indexOf(task);

	if(task) {
		tasks.splice(taskIndex, 1);
	}

	console.log('Removing:');
	listTask(task);
};

/**
 * Set a task as "done" or "closed"
 *
 * @return {undefined}
 */
var closeTask = function closeTask() {
	var taskID = parseInt(passedData, 10);
	var task = _.findWhere(tasks, {id: taskID});

	if(task) {
		task.open = false;
	}

	console.log('closing:');
	listTask(task);
};

// Start the program
init();
