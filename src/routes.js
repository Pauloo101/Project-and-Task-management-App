const express = require('express');
const router = new express.Router;
const TaskActions = require("./controller/TaskController")
const ProjectActions = require("./controller/ProjectController")

router.post("/task/create", TaskActions.createTask);
router.get("/tasks", TaskActions.allTasks);
// task/object _id
router.get("/task/:id", TaskActions.getTaskByID);
router.delete("/task/:id", TaskActions.deleteTaskByID);
router.put("/task/:id", TaskActions.editTaskByID);
// task/start/object _id
router.put("/task/start/:id", TaskActions.taskStartedAt);
// task/changeTaskStatus/object _id
router.put("/task/changeTaskStatus/:id", TaskActions.changeTaskStatus)

//tasks/filterByStatus?status=false
router.get("/tasks/filterByStatus", TaskActions.filterTaskByStatus)

// tasks/filterTaskByTitle?title=A title or related words in title
router.get("/tasks/filterTaskByTitle", TaskActions.filterTaskByTitle)

// ?date=date in this format yyyy-mm-dd
router.get("/tasks/byStartedAt/", TaskActions.filterByStartedAt)
router.get("/tasks/byDueAt", TaskActions.filterByDueAt)
router.get("/tasks/byCompletedAt", TaskActions.filterByCompletedAt)


/* Project Routes */
router.post("/project/create", ProjectActions.createProject);
/* Gets all projects with corresponding tasks */
router.get("/projects", ProjectActions.allProjects);
/* Get project by id and includes the  */
router.get("/project/:id", ProjectActions.getProjectById);
/* Edit a project by  */
router.put("/project/:id", ProjectActions.editProject);
router.put("/project/assignTaskToProject/:id", ProjectActions.assignTaskToProject);
router.delete("/project/:id", ProjectActions.deleteProjectById);
router.get("/getproject/tasks/", ProjectActions.filterTaskByProject)
router.get("/projectsByStartDate", ProjectActions.sortProjectByStartDate);
router.get("/projectsByDueDate",  ProjectActions.sortProjectByDueDate)



module.exports = router