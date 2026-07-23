const {
    getDashboardStats
} = require("../models/dashboardModel");

const getDashboard = async (req, res) => {
    try {

        const stats = await getDashboardStats(req.user.id);

        res.status(200).json(stats);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getDashboard
};