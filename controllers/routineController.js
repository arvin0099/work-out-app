const {User, Routine, Exercise} = require("../models/User");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middleware/verifyToken");

//delete functions use req.params to access user, routine and exercise
//upon successful delete, message is sent back to user via json
const deleteRoutine = async(req,res,next) => {

    const { userId, routineId } = req.params;
    
    try{


    }catch(err){
        console.log(err);
        return res.status;
    }
}

//update routines use req.body to pass user data from front end to database for update
//upon successful update, message is sent back to user via json
const updateRoutine = async(req, res, next) => {

    const {userId, routineId} = req.params;
    const updatedRoutine = req.body;
    
    console.log("Updated Routine", updatedRoutine);
    try{
        //find schema by userId
        const user = await User.findById(userId);

        //find routine to update by routineId
        const oldRoutine = user.routines.id(routineId);

        console.log("This is the old routine", oldRoutine);

        //update entire oldRoutine with updatedRoutine
        Object.assign(oldRoutine, updatedRoutine);
        await user.save();


    }catch(err){
        console.log(err);
        return res.status;
    }

}

const createRoutine = async(req, res, next) => {
    const userId = req.params.userId;

    try{
        const user = await User.findById(userId);
        const newRoutine = await Routine.create(req.body);

        console.log("New Routine: ", newRoutine);
        console.log("user: ", user);
        user.routines.push(newRoutine);

        await user.save();

        return res.status(201).json({message: "User successfully created", userId})

    }catch(err){
        console.log(err);
    }
}

module.exports = {
   deleteRoutine,
   updateRoutine,
   createRoutine
}