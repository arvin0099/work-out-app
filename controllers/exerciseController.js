const { User, Routine, Exercise} = require("../models/User"); 
//unsure if necessary to import Routine and Exercise
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middleware/verifyToken");

//delete functions use req.params to access user, routine and excercise
//upon successful delete, message is sent back to user via json
const deleteExercise = async(req,res,next) => {
    console.log('delete exercise Hit')

    const { userId, routineId, exerciseId } = req.params;
    
    try{

        //find schema by userId
        const user = await User.findById(userId);

        //find routine to update by routineId
        const oldRoutine = user.routines.id(routineId);
        const oldExercise = oldRoutine.exercises.id(exerciseId);

        // console.log("This is the old routine", oldExercise);

        //delete routine
        await User.updateOne(
            {_id: userId, "routines._id": routineId },
            { $pull: { "routines.$.exercises": {_id: exerciseId}}}
        );

    }catch(err){
        console.log(err);
        return res.status;
    }
}

//update routines use req.body to pass user data from front end to database for update
//upon successful update, message is sent back to user via json
const updateExercise = async (req, res, next) => {
    console.log('updateExercise Hit')
    const { userId, routineId, exerciseId } = req.params;
    const { sets, reps, weight } = req.body;
    console.log(sets + reps + weight)
    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(
            exerciseId,
            { $set: { sets, reps, weight } },
            { new: true, runValidators: true }
        );

        console.log(updateExercise)

        if (!updatedExercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        res.json(updatedExercise);
    } catch (error) {
        console.error("Failed to update exercise:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const createExercise = async(req, res, next) => {

    const {userId, routineId} = req.params;

    try{
        const user = await User.findById(userId);
        const routine = user.routines.id(routineId);

        const newExercise = await Exercise.create(req.body);

        console.log("New Routine: ", newExercise);
        console.log("user: ", user);
        routine.exercises.push(newExercise);

        await user.save();

        return res.status(201).json({message: "User successfully created", userId})


    }catch(err){
        console.log(err);
    }
}

module.exports = {
   deleteExercise,
   updateExercise,
   createExercise
}