import axios from 'intercepter/axios';

export async function getTask(query = {}, options = {}) {
    try {
        const response = await axios.get('/task', {
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

export async function createTask(data) {
    try {
        const response = await axios.post('/task', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateTask(idOfTask, data) {
    try {
        const response = await axios.put(`/task/${idOfTask}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
