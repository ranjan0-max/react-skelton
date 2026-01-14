import axios from 'intercepter/axios';

export async function getRecurrenceTask(query = {}, options = {}) {
    try {
        const response = await axios.get('/recurrenceTask', {
            params: {
                ...query,
            },
            signal: options.signal
        });

        return response.data;
    } catch (error) {
        return error.data;
    }
}

export async function createRecurrenceTask(data) {
    try {
        const response = await axios.post('/recurrenceTask', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateRecurrenceTask(idOfTask, data) {
    try {
        const response = await axios.put(`/recurrenceTask/${idOfTask}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}