# task
My own task management system as I couldn't find one that fits my needs. Uses my taskengine library which is found here: https://github.com/scazan/taskengine

Uses a simple json file so it can be consumed via a number of other interfaces (command line, phone, web, etc) . Supports subtasks, deadlines, single subtasks assigned to multiple tasks, and all the normal things a task manager does.

To install, download this repository (or git clone it) into ~/dev/task (if you want to change that directory, just put it anywhere and edit the "task" file which is simply a bash script pointing to the executable):
```
touch ~/tasks.json
npm install
```

To use globally, add the directory to your path:
```
export PATH=/dev/task:$PATH
```


## Use
I've added in a shortcut for task that uses the letter t in place of any reference to task in the following (ie. 't ls' or 't add "name:blah" ')

Listing:
```
task 
task ls
task ls a
task ls all
```

Adding:
```
task add "name:some name, description:some descriptive text here, url: http://www.google.com"
```

Sub tasks (for example on task id 8):
```
task add 8 "name:some name, description:some descriptive text here, url: http://www.google.com"
task ls 8
```

Removing:
```
task rm 12
```

Marking complete:
```
task x 8
task close 8
```

Editing:
```
task edit 8 "url: http://www.duckduckgo.com"
```
