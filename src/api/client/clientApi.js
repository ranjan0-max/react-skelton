import axios from 'intercepter/axios';

export async function getClient(query = {}, options = {}) {
    try {
        const response = await axios.get('/client', {
            params: {
                ...query
            },
            signal: options.signal
        });
        return response.data;
    } catch (error) {
        return error.data;
    }
}

export async function createClient(data) {
    try {
        const response = await axios.post('/client', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateClient(idOfClient, data) {
    try {
        const response = await axios.put(`/client/${idOfClient}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
