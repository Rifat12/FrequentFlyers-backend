"use strict";

const db = require('../models');
const Trip = db.trip;
const Event = db.event;
const FlightOffer = db.flightOffer;

class TripService {
    async createTrip(userId, tripData) {
        try {
            const trip = await Trip.create({
                userId,
                name: tripData.name,
                destination: tripData.destination,
                startDate: tripData.startDate,
                endDate: tripData.endDate
            });
            return trip;
        } catch (error) {
            throw error;
        }
    }

    async getUserTrips(userId) {
        try {
            const trips = await Trip.findAll({
                where: { userId },
                include: [
                    { model: Event, as: 'events' },
                    { model: FlightOffer, as: 'flightOffers' }
                ],
                order: [['startDate', 'ASC']]
            });
            return trips;
        } catch (error) {
            throw error;
        }
    }

    async getTripById(tripId, userId) {
        try {
            const trip = await Trip.findOne({
                where: { 
                    id: tripId,
                    userId 
                },
                include: [
                    { model: Event, as: 'events' },
                    { model: FlightOffer, as: 'flightOffers' }
                ]
            });
            if (!trip) {
                throw new Error('Trip not found');
            }
            return trip;
        } catch (error) {
            throw error;
        }
    }

    async addEvent(tripId, userId, eventData) {
        try {
            // Verify trip belongs to user
            const trip = await Trip.findOne({
                where: { 
                    id: tripId,
                    userId 
                }
            });
            if (!trip) {
                throw new Error('Trip not found');
            }

            const event = await Event.create({
                tripId,
                name: eventData.name,
                date: eventData.date,
                time: eventData.time
            });
            return event;
        } catch (error) {
            throw error;
        }
    }

    async getEvents(tripId, userId) {
        try {
            // Verify trip belongs to user
            const trip = await Trip.findOne({
                where: { 
                    id: tripId,
                    userId 
                }
            });
            if (!trip) {
                throw new Error('Trip not found');
            }

            const events = await Event.findAll({
                where: { tripId },
                order: [['date', 'ASC'], ['time', 'ASC']]
            });
            return events;
        } catch (error) {
            throw error;
        }
    }

    async associateFlightWithTrip(tripId, userId, flightOfferId) {
        try {
            // Verify trip belongs to user
            const trip = await Trip.findOne({
                where: { 
                    id: tripId,
                    userId 
                }
            });
            if (!trip) {
                throw new Error('Trip not found');
            }

            await FlightOffer.update(
                { tripId },
                { where: { id: flightOfferId } }
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TripService();
