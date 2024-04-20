const {User, Routine, Exercise } = require("../models/User");
const bcrypt = require("bcrypt");
const {createToken} = require("../middleware/verifyToken");

const findLastWorkout = async(userId) => {

    try{
        const result = await User.aggregate([
            { $match: { _id: Mongoose.Types.ObjectId(userId)} },
            { $unwind: '$routines'},
            { $unwind: '$routines.workouts' },
            { $sort: { 'routines.workouts.date': -1} },
            { $limit: 1},
            { $project: { _id: 0, date: '$routines.workouts.date'}}
        ]);

        return result.length > 0 ? result[0].date : null;

    }catch(error){
        console.error("Failed to find last workout:", error);
        return null;
    }
}

const signup = async(req, res) => {
    try{
        
        const {email, username, password} = req.body;
        console.log("Req body: ", req.body);
        //prep the query for execution
        const query = User.find({});

        //check for existing username and/or email
        query.or([{username: username}, {email: email}]);

        //execute the query
        const foundUser = await query.exec();
        
        // return message if user and/or email already exist
        if(foundUser.length !== 0){
            return res.status(400).json({message: "Username or Email already taken"});
        }

        //salt and has the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //replace raw password with hashed password 
        req.body.password = hash;
        
        //signup the user (create)
        const createdUser = await User.create(req.body);
        await createdUser.save();

        return res.status(201).json({message: "User successfully registered", userId: createdUser.id});

    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal server error"})
    }
}

const login = async(req,res) => {
    try{
        const {username, email, password} = req.body;

        const foundUser = await User.find({
            $and: [{username: username}, {email: email}]
        });

        //console.log("found user", foundUser);

        //user not found
        if(foundUser.length === 0){
            return res.status(400).json({error: "Invalid login credentials"});
        }

        // compare user password with foundUser password
        const verifyPassword = await bcrypt.compare(password, foundUser[0].password);

        //if passwords don't match return error
        if(!verifyPassword){
            return res.status(400).json({error: "Invalid login credentials"});
        }

        //if password matches give the foundUserdata to create the JWT
        const token = createToken(foundUser[0]);
        
        //return date to variable
        //const lastDate = await findLastWorkout(foundUser[0]._id);

        //passthe frontend our JWT with the user
        return res.status(200).json({token, id: foundUser[0]._id, username: foundUser[0].username })
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal server error"});
    }
}

const getUser = async(req,res)=>{
    try{
        const id = req.params.id;
        const query = User.findById(id);

        // exclude password from returning with query
        query.select("-password");
        const foundUser = await query.exec();

        if(!foundUser){
            return res.status(400).json({error: "User not found"});
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal server error"});
    }
}

const getUserData = async (req, res) => {
    const id = req.params.id
    console.log('this is the ID ' + id)
    try {
        const user = await User.findById(id).select('-password')
        console.log('Fetched user data:', user);

        if (!user) {
            console.log('No user found with ID:', id);
            return res.status(404).json({ message: 'User not found' })
        }

        res.json(user)
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
};

const deleteUser = async(req, res) => {
    try{

    }catch(err){

    }

}

const updateUser = async(req, res) =>{
    console.log("Update user route hit")
    const userId = req.params.userId
    const { firstName, lastName, dob, weight } = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    bodyWeight: weight
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getUser,
    signup,
    login,
    deleteUser,
    updateUser,
    getUserData
}