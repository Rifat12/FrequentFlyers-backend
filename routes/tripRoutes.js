"use strict";

const express = require('express');
const router = express.Router();
const tripService = require('../services/tripService');
const { authCheck } = require('./authRoutes');

// Create new trip
router.post('/', authCheck, async (req, res) => {
    try {
        const { name, destination, startDate, endDate } = req.body;
        if (!name || !destination || !startDate || !endDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Use userId from session
        const trip = await tripService.createTrip(req.session.userId, {
            name,
            destination,
            startDate,
            endDate
        });
        res.status(201).json(trip);
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

// Get all trips for logged-in user
router.get('/', authCheck, async (req, res) => {
    try {
        // Use userId from session
        const trips = await tripService.getUserTrips(req.session.userId);
        res.json(trips);
    } catch (error) {
        console.error('Get trips error:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Get specific trip (verifying ownership)
router.get('/:tripId', authCheck, async (req, res) => {
    try {
        // Use userId from session to verify ownership
        const trip = await tripService.getTripById(req.params.tripId, req.session.userId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        console.error('Get trip error:', error);
        if (error.message === 'Trip not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
});

// Add event to trip
router.post('/:tripId/events', authCheck, async (req, res) => {
    try {
        const { name, date, time } = req.body;
        if (!name || !date || !time) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Use userId from session to verify trip ownership
        const event = await tripService.addEvent(req.params.tripId, req.session.userId, {
            name,
            date,
            time
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Add event error:', error);
        if (error.message === 'Trip not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Get trip events
router.get('/:tripId/events', authCheck, async (req, res) => {
    try {
        // Use userId from session to verify trip ownership
        const events = await tripService.getEvents(req.params.tripId, req.session.userId);
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        if (error.message === 'Trip not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Associate flight with trip
router.post('/:tripId/flights/:flightOfferId', authCheck, async (req, res) => {
    try {
        // Use userId from session to verify trip ownership
        await tripService.associateFlightWithTrip(
            req.params.tripId,
            req.session.userId,
            req.params.flightOfferId
        );
        res.json({ message: 'Flight associated with trip successfully' });
    } catch (error) {
        console.error('Associate flight error:', error);
        if (error.message === 'Trip not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to associate flight with trip' });
    }
});

module.exports = router;
