const express = require("express");
const router = express.Router();

const eventControllers = require("../controllers/eventControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, eventControllers.createEvent);
router.delete("/delete/:id", authenticateToken, eventControllers.deleteEvent);
router.post("/update/:id", authenticateToken, eventControllers.updateEvent);
router.post("/attendance/:id", authenticateToken, eventControllers.toggleAttendance);
router.get("/search", eventControllers.searchEvents);
router.get("/next", eventControllers.getNextEvents);
router.get("/old", eventControllers.getAllEvents);
router.post("/enroll", authenticateToken, eventControllers.enrollEvent);
router.get("/user/next", authenticateToken, eventControllers.getUserNextEvents);
router.get("/user/old", authenticateToken, eventControllers.getUserOldEvents);

module.exports = router;
