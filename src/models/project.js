
const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
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
    tasks:[{
        type: mongoose.Schema.Types.ObjectId, ref:'Task'
    }]},
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("Project", ProjectSchema)