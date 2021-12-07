const project = require('../models/project');
const Project = require('../models/project');
const Task  = require('../models/task');

function getNextDay (queryDate){
    dateData = new Date(queryDate)
    return new Date(dateData.setDate(dateData.getDate() + 1))
}

module.exports = {
    /**
     * Create Project 
     * payload: name, description
      */
    createProject: async (request, response)=>{
        try{
            const {name, description, dueAt} = request.body;
            const project = await Project.create({name, description, "dueAt":new Date(dueAt).toLocaleDateString()})
            return response.send({
                "msg":"Project created successfully",
                "status":true,
                "project":project
            })
        }catch(err) {
            console.log(err)
            return response.send({
                "msg":"project creation failed",
                "status":false,
            })
        }
    },
    /*
         Fetch all projects from the datebase
     */
    allProjects: async (request, response)=>{
        try {
            const projects = await Project.find({}).populate('tasks')
            if(projects){
                return response.send({
                    "msg":"All Projects reterived",
                    "status":true,
                    "project":projects
                })
            }else{
                return response.send({
                    "status":false,
                    "project":"No project exists"
                })
            }
        } catch (error) {
            console.log(error.message)
            return response.send({
                "msg":"Unable to fetch project",
                "status":false,
            })
        }
    },
    /**
     * Fetch project by id'
     * also get tasks ralated to project
      */
    getProjectById: async (request, response)=>{
        try{
            const project = await Project.findById(request.params.id).populate("tasks")
            if(project){
                return response.send({
                    "status":true,
                    "project":project
                })
            }else{
                return response.send({
                    "msg":"Project not found",
                    "status":false
                })
            }
        }catch(error){
            console.log(error)
            return response.send({
                "msg":"Unable to find project",
                "status":false
            })
        }
    },
    /**
     * Edit Project by providing the id of the project
     * via params and the record to be updated via request body
      */
    editProject: async (request, response)=>{
        try {
            const project = await Project.findByIdAndUpdate(request.params.id,{
                ...request.body
            }, {new:true, upsert:false})
            return response.send({
                "msg": "Project Updated",
                "status": true,
                "project": project
            })
        } catch (error) {
            console.log(error)
            return response.send({
                "msg": "Project updated failed",
                "status":false
            })
        }
    },
    /**
     * Assign a task to project(s)
      */
    assignTaskToProject: async (request, response)=>{
        try {
            const project = await Project.findById(request.params.id);
            const task = await Task.findById(request.body.taskId);
            project.tasks.push(task)
            await project.save();
            return response.send({
                "msg":"Task assigned to project",
                "status":true
            })
        } catch (error) {
            console.log(error)
            return response.send({
                "msg":"Task assigned to project failed",
                "status":false
            })
        }
    },
    /**
     * Delete a project by id
     * Id is required and specficed in the request params
      */
    deleteProjectById: async (request, response)=>{
        try {
            const project = await Project.findByIdAndDelete(request.params.id).exec();
            return response.send({
                "msg": "Project deleted successfully",
                "status": true
            })
        } catch (error) {
            return response.send({
                "msg": "Project not deleted",
                "status": false

            })
        }
    },
    /**
     * Fetch tasks related to a specfic task
      */
    filterTaskByProject: async (request, response)=>{
        try {
            const tasks = await Project.find({name: {$regex: '.*' + request.query.name + '.*', $options: 'i'}}, 'tasks').populate('tasks')
            return response.send({
                "status":true,
                "tasks":tasks
            })
        } catch (error) {
            console.log(error.message)
            return response.send({
                "status":false,
                "msg":"Unable to fetch project tasks"
            })
        }
    },
    /**
     * Sort Project by Start Date 
     * using ISO date format
      */
    sortProjectByStartDate: async (request, response)=>{
        try {
            const projects = await Project.find({
                $or:[
                    {createdAt: {$gte: new Date(request.query.date), $lt:getNextDay(request.query.date)}},
                    {startedAt: {$gte: new Date(request.query.date), $lt:getNextDay(request.query.date)}}
                ]
            });
            if(projects.length > 0 ){
                return response.send({
                    "projects": projects,
                    "status":true
                })
            }else{
                return response.send({
                    "msg":"No projects found",
                    "status":false
                })
            }
            
        } catch (error) {
            return response.send({
                "msg":"An erorr error occured",
                "status":false
            })
        }
    },
    /**
     * Sort Projects by Due that using
     * ISO date format and 24 hrs range
      */
    sortProjectByDueDate: async (request, response)=>{

        try {
            const projects = await Project.find({dueAt: {$gte: new Date(request.query.date), $lte:getNextDay(request.query.date)}})
            // const projects = await Project.find({dueAt: new Date(request.query.date)})
            if(projects.length > 0) {
                return response.send({
                    "status":true,
                    "projetcs":projects
                })
            }else{
                return response.send({
                    "status":false,
                    "msg":"No projects found matching the due date specified"
                })
            }
        } catch (error) {
            return response.send({
                "status":false,
                "msg":`An error occurred while processing projects with due date ${request.query.date}`
            })
        }
    }


}