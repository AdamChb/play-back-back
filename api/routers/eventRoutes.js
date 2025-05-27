const express = require("express");
const router = express.Router();

const eventControllers = require("../controllers/eventControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/get/:id", eventControllers.getEventById);
router.post("/create", authenticateToken, eventControllers.createEvent);
router.delete("/delete/:id", authenticateToken, eventControllers.deleteEvent);
router.post("/update/:id", authenticateToken, eventControllers.updateEvent);
router.post("/attendance", authenticateToken, eventControllers.checkAttendance);
router.get("/search", eventControllers.searchEvents);
router.get("/games/:id", eventControllers.getEventGames);
router.get("/next", eventControllers.getNextEvents);
router.get("/all", eventControllers.getAllEvents);
router.post("/enroll/:id", authenticateToken, eventControllers.enrollEvent);
router.get("/user/next", authenticateToken, eventControllers.getUserNextEvents);
router.get("/user/old", authenticateToken, eventControllers.getUserOldEvents);

module.exports = router;
