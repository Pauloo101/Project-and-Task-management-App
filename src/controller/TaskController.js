const Task =  require('../models/task');
const moment = require('moment');

function getNextDay (queryDate){
    dateData = new Date(queryDate)
    return new Date(dateData.setDate(dateData.getDate() + 1))
}
module.exports = {
    /**
     * Create Task by providing this dataset
     * title, description, status and dueAt
     */
    createTask: async (request, response) => {
        try {
            const {title, description , status, dueAt} = request.body;
            const task = await Task.create({
                title,
                description,
                status,
                dueAt
            })
            return response.send({
                "task": task,
                "status":true,
                "msg":"Task Created"
            })
        } catch (error) {
            console.log(error)
            return response.send({
                "msg":"Error unable create task",
                "status":false
            })
        }
    },

    /** 
     * Gets all avaliable tasks from the database
     */
    allTasks: async (request, response) =>{
        try{
           const tasks = await Task.find();
            if(tasks){
                return response.send({
                    "tasks":tasks,
                    "status":true,
                    "msg": "All tasks retrieved successfully"
                });
            }else{
                return response.send({
                    "status":false,
                    "msg": "No task exists"
                });
            }
        } catch (error){
            console.log(error)
            response.send({
                "msg":"Error fetching tasks",
                "status":false,
            })
        }
    },
    /**
     * Fetch tasks by Id
      */
    getTaskByID: async (request, response) => {
        try {
            const task = await Task.findById(request.params.id);
            if(task){
                return response.send({
                    "status": true,
                    "task": task
                });
            }else{
                return response.send({
                    "msg":"Task with this id does not exist",
                    "status": false
                });
            }
        } catch (error) {
            console.log(error)
            return response.send({
                "msg":"Unable to find task",
                "status": false
            })
        }
    },
    /**
     * Update task record.
     * taskid is should be provided via the request params
      */
    editTaskByID: async (request, response) => {
        try {
            const task = await Task.findByIdAndUpdate(request.params.id,{
                ...request.body
            }, {new:true, upsert:false} )
            return response.send({
                "msg":"Task Updated",
                "status":true,
                "task":task
            })
        } catch (error) {
            console.log(error)
            return response.send({
                "status":false,
                "msg":"Task Update Failed"
            })
        }
    },
    /**
     * Delete a task by a specfic id
     * id should be provided via params
      */
    deleteTaskByID: async (request, response) => {
        try {
            const task = await Task.findByIdAndDelete(request.params.id).exec();
            return response.send({
                "msg":"task delete",
                "status":true
            })
        } catch (error) {
            console.log(error)
            return response.send({
                "msg":"unable to delete task",
                "status":false
            })
        }
    },
    /**
     * Change status of a task to either completed or not completed
      */
    changeTaskStatus: async(request, response)=>{
        try{
            const task = await Task.findByIdAndUpdate(request.params.id, 
                {status:request.body.status, 
                completedAt:request.body.status ? new Date().toISOString() : null  },
                {new:true, upsert:false})
                
            return response.send({
                "msg":"Task status updated successfully",
                "status":true,
                "task":task
            })
        } catch(error){
            console.log(error)
            return response.send({
                "msg":"unable to update task status",
                "status":false,
            })
        }
    },
    /**
     * Filter tasks by status
     * status can either be true or false
     * and provided by via request query 
      */
    filterTaskByStatus: async (request, response)=>{
        try{
            const tasks = await Task.find({status:request.query.status}).exec()
            if(tasks.length > 0){
                return response.send({
                    "msg":`Task with status(${request.query.status}) fetched`,
                    "status":true,
                    "tasks":tasks
                });
            }else{
                return response.send({
                    "msg":`No task(s) found matching status(${request.query.status})`,
                    "status":false,
                })
            }
        } catch (error) {
            console.log(error);
            return response.send({
                "msg":`Unable to fetch tasks with status ${request.query.status})`,
                "status":false,
            })
        }
    },
    /**
     * Filter task by title
     * title should be provided via request query
      */
    filterTaskByTitle: async (request, response) => {
        try{
            const tasks = await Task.find({title:{ $regex: '.*' + request.query.title + '.*', $options: 'i' }}).exec();
            if(tasks.length> 0){
                return response.send({
                    "msg":`Task with title ${request.query.title} fetched`,
                    "status":true,
                    "task":tasks
                })
            }else{
                return response.send({
                    "msg":`No task found matching title ${request.query.title}`,
                    status:false,
                })
            }
        }catch(error){
            console.log(error);
            return response.send({
                "msg":`Unable to fetch task with title ${request.query.title}`
            })
        }
    },
    /**
     * Set the Start time for a task.
     */
    taskStartedAt: async (request, response) => {
        try{
            const task = await Task.findByIdAndUpdate(request.params.id, {startedAt: new Date().toISOString()}, {new:true, upsert:false})
            return response.send({
                "msg":"Task started",
                "status":true,
                "task":task
            })
        }catch(error){
            console.log(error);
            return response.send({
                "msg":"Unable to fill task start time",
                "status":false,
            })
        }
    },
    /**
     * Filters Tasks by startedAt Date if it is avaliable
     * if not it used the createdAt TimeStamp
     * 
     *  **/ 
    filterByStartedAt: async(request, response)=>{
        try {
            const taskByStartedAt = await Task.find({
                $or:[
                    {createdAt: {$gte: new Date(request.query.date), $lt: getNextDay(request.query.date)}},
                    {startedAt:{$gte: new Date(request.query.date), $lt: getNextDay(request.query.date)}}
                ]
            })
            if(taskByStartedAt.length > 0){
                return response.send({
                    "tasks":taskByStartedAt,
                    "status":true
                })
            }else{
                return response.send({
                    "msg":"No task created or started on this date",
                    "status":true
                })
            }
        } catch (error) {
            console.log(error)
            return response.send({
                "status":false,
                "msg":"Error fetching data by Start date"
            })
        }
         
    },
    filterByDueAt: async(request, response)=>{
        try {
        const taskByDueAt = await Task.find({dueAt:{$gte: new Date(request.query.date), $lt: getNextDay(request.query.date)} })
            if(taskByDueAt.length > 0){
                return response.send({
                    "tasks":taskByDueAt,
                    "status":true
                })
            }else{
                return response.send({
                    "msg":"No task with the specficed due date",
                    "status":false
                })
            }
        } catch (error) {
            return response.send({
                "msg":'error fetching task with specficed due date',
                "status":false
            })
        }        
       
    },

    filterByCompletedAt: async(request, response)=>{
        try {
            const taskByCompletedAt = await Task.find({completedAt: {$gte: new Date(request.query.date), $lt: getNextDay(request.query.date)} })
            if(taskByCompletedAt.length > 0){
                return response.send({
                    "tasks":taskByCompletedAt,
                    "status":true
                })
            }else{
                return response.send({
                    "msg":"No task completed for this date",
                    "status":false
                })
            }
        } catch (error) {
            console.log(error)
            return response.send({
                "status":false,
                "msg":"Error fetching data by completed date"
            })
        }

    },

}