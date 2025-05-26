const { validateAdmin, validateUser, validateEmployee } = require("../middleware/validationMiddleware");

const Event = require("../models/eventModels");

const createEvent = async (req, res) => {
    const { nom_session, description, date_heure, difficulte, nb_part_max, duree, ID_jeux } = req.body;
    try {
        if (!validateEmployee(req.user) && !validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        if (!ID_jeux || ID_jeux.lenght === 0) {
            return res.status(400).json({ message: "Game ID is required" });
        }
        const newEvent = await Event.createEvent(nom_session, description, date_heure, difficulte, nb_part_max, duree, ID_jeux);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        if (!validateEmployee(req.user) && !validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        await Event.deleteEvent(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { nom_session, description, date_heure, difficulte, nb_part_max, duree } = req.body;
    try {
        if (!validateEmployee(req.user) && !validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const affectedRows = await Event.updateEvent(id, nom_session, description, date_heure, difficulte, nb_part_max, duree);
        if (affectedRows === 0) {
            return res.status(400).json({ message: "No changes made" });
        }
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const checkAttendance = async (req, res) => {
    const { eventId, userId } = req.body;
    try {
        if (!validateUser(req.user) && !validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const isEnrolled = await Event.checkAttendance(eventId, userId);
        res.status(200).json({ enrolled: true, message: "Attendance checked successfully" });
    } catch (error) {
        console.error("Error checking attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const searchEvents = async (req, res) => {
    const { event } = req.query;
    try {
        const events = await Event.searchEvents(event);
        res.status(200).json(events);
    } catch (error) {
        console.error("Error searching events:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getNextEvents = async (req, res) => {
    try {
        const events = await Event.getNextEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting next events:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting all events:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const enrollEvent = async (req, res) => {
    const { id } = req.params;
    try {
        if (!validateUser(req.user) && !validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const attendance = await Event.enrollEvent(id, req.user.id);
        if (attendance.enrolled) {
            res.status(200).json({ message: "User enrolled in event", enrolled: true });
        } else {
            res.status(200).json({ message: "User unenrolled from event", enrolled: false });
        }
    } catch (error) {
        console.error("Error toggling attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserNextEvents = async (req, res) => {
    try {
        if (!validateUser(req.user) && !validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const events = await Event.getUserNextEvents(req.user.id);
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting user's next events:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserOldEvents = async (req, res) => {
    try {
        if (!validateUser(req.user) && !validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const events = await Event.getUserOldEvents(req.user.id);
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting user's old events:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    checkAttendance,
    searchEvents,
    getNextEvents,
    getAllEvents,
    enrollEvent,
    getUserNextEvents,
    getUserOldEvents
};