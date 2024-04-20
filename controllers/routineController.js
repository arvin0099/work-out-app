const {User, Routine, Exercise} = require("../models/User");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middleware/verifyToken");


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

const showCreateRoutine = async(req, res, next) => {
    try{

    }catch(err){
        console.log(err)
    }
}

//shows routines on frontend at route address in index.js
const readRoutine = async(req,res,next) => {
   
    const userId = req.params.userid;
    
    try{
        const user = await User.findById(userId);
        
        routines = user.routines;
        
        return res.status(201).json({message: "Rourtine successfully grabbed", routines: routines})
    } catch(err){
        console.log(err);
    }

}

//update routines use req.body to pass user data from front end to database for update
//upon successful update, message is sent back to user via json
// RETURNING OBJECT {BLAH BLAH}
const updateRoutine = async (req, res) => {
    const { userId, routineId } = req.params;
    const { name, day } = req.body;

    console.log("Update routine route hit");
    console.log("UserID:");
    console.log("Data to update:", name, day);
//Routes are not my specialty and having some difficulty with them, had to have some help with chatGPT
    try {
        const user = await User.findOneAndUpdate(
            { "_id": userId, "routines._id": routineId },
            {
                "$set": {
                    "routines.$.name": name,
                    "routines.$.day": day,
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Routine not found in the specified user." });
        }
        res.status(200).json({ message: "Routine updated successfully"});
    } catch (error) {
        console.error('Error updating routine:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}




//delete functions use req.params to access user, routine and exercise
//upon successful delete, message is sent back to user via json
const deleteRoutine = async (req, res) => {
    const { userId, routineId } = req.params;

    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { routines: { _id: routineId } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: "User not found or routine cannot be removed." });
        }

        if (result.routines.id(routineId) === null) {
            res.status(200).json({ message: "Routine deleted successfully" });
        } else {
            throw new Error("Deletion failed");
        }
    } catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
   deleteRoutine,
   updateRoutine,
   createRoutine,
   readRoutine,
   showCreateRoutine
}