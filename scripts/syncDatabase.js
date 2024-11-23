require('dotenv').config();
const db = require('../models');

async function syncDatabase() {
    try {
        // Force sync all models
        // WARNING: This will drop all tables and recreate them
        await db.sequelize.sync({ force: true });
        console.log('Database synced successfully');

        // Close the connection
        await db.sequelize.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
}

// Run the sync
syncDatabase();
