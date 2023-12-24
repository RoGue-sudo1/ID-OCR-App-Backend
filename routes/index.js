// Import the Express module to create a router
const router = require("express").Router();

// Import the image controller module that handles image-related operations
const imageController = require("../controllers/imageControler");

// Define a route for handling POST requests to the root endpoint ("/")
router.post("/", imageController.getImage);

// Export the router to make it available for use in other parts of the application
module.exports = router;
