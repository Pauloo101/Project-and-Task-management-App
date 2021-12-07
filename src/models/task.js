const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    startedAt:{
        type:Date,
        required:false
    },
    dueAt:{
        type:Date,
        required:false
    },
    completedAt:{
        type:Date,
        required:false
    }
}, {
    timestamps:true
})


module.exports = mongoose.model("Task", TaskSchema);
