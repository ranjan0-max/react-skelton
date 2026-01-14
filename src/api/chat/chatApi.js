import axios from 'intercepter/axios';

export async function getChat(query = {}) {
    try {
        const response = await axios.get('/chat', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function getRoomIdForTask(query = {}) {
    try {
        const response = await axios.get('/chat/checkTaskRoom', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function createChat(data) {
    try {
        const response = await axios.post('/chat', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
