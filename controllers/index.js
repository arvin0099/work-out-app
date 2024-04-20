const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const userCtrl = require("./userController");
const routineCtrl = require("./routineController");
const exerciseCtrl = require("./exerciseController");

console.log('this is just a test')

// auth signup
router.post("/auth/signup", userCtrl.signup);

//auth/login
router.post("/auth/login", userCtrl.login);
router.get("/user/:id", verifyToken, userCtrl.getUser);

/*----SHOW-----*/
router.get("/user/:userid/routines", routineCtrl.readRoutine);
router.get("/userdata/:id", userCtrl.getUserData)
router.get("/createroutines", routineCtrl.showCreateRoutine)

/*---- DELETE ----*/
//delete user
router.delete( "/user/:userId", verifyToken, userCtrl.deleteUser);

//delete routine
router.delete( "/user/:userId/routine/:routineId", routineCtrl.deleteRoutine)

//delete exercise 
router.delete( "/user/:userId/routine/:routineId/exercise/:exerciseId", exerciseCtrl.deleteExercise)

/*---- UPDATE ----*/
//update user
router.put("/user/:userId", (req, res, next) => {
    console.log("Update user route hit");
    next();
}, userCtrl.updateUser);

//update routine
router.put("/user/:userId/routine/:routineId",  routineCtrl.updateRoutine)

//update exercise
router.put("/user/:userId/routine/:routineId/exercise/:exerciseId", exerciseCtrl.updateExercise)


/*---- CREATE----*/

//create routine
router.post("/user/:userId/routine", routineCtrl.createRoutine)

//create exercise
router.post("/user/:userId/routine/:routineId/exercise", exerciseCtrl.createExercise)


module.exports = router;