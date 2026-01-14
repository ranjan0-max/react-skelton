import axios from 'intercepter/axios';

export async function getUserDashboardData(query = {}) {
    try {
        const response = await axios.get('/dashboard/useDashboard', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function getClientWebDashboardData(query = {}) {
    try {
        const response = await axios.get('/dashboard', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}