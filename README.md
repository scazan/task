# task
My own task management system as I couldn't find one that fits my needs. Uses a simple json file so it can be consumed via a number of other interfaces (command line, phone, web, etc) . Supports subtasks, deadlines, single subtasks assigned to multiple tasks, and all the normal things a task manager does.

```
touch ~/tasks.json
```

## Use

Adding:
```
task add "name:some name, description:some descriptive text here, url: http://www.google.com"
```
Listing:
```
task 
task ls
task ls a
task ls all
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
