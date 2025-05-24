const { validateAdmin, validateUser, validateEmployee } = require("../middleware/validationMiddleware");

const Event = require("../models/eventModels");

const createEvent = async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        if (!validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const newEvent = await Event.createEvent(title, description, date, location);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        if (!validateEmployee(req.user)) {
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
    const { title, description, date, location } = req.body;
    try {
        if (!validateEmployee(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const updatedEvent = await Event.updateEvent(id, title, description, date, location);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const toggleAttendance = async (req, res) => {
    const { id } = req.params;
    try {
        if (!validateUser(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const attendance = await Event.toggleAttendance(id, req.user.id);
        res.status(200).json(attendance);
    } catch (error) {
        console.error("Error toggling attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const searchEvents = async (req, res) => {
    const { query } = req.query;
    try {
        const events = await Event.searchEvents(query);
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
    const { id } = req.body;
    try {
        if (!validateUser(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const event = await Event.findEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const enrollment = await Event.enrollEvent(id, req.user.id);
        res.status(200).json(enrollment);
    } catch (error) {
        console.error("Error enrolling in event:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserNextEvents = async (req, res) => {
    try {
        if (!validateUser(req.user)) {
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
        if (!validateUser(req.user)) {
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
    toggleAttendance,
    searchEvents,
    getNextEvents,
    getAllEvents,
    enrollEvent,
    getUserNextEvents,
    getUserOldEvents
};