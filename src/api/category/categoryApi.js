import axios from 'intercepter/axios';

export async function getCategory(query = {}, options = {}) {
    try {
        const response = await axios.get('/category', {
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

export async function createCategory(data) {
    try {
        const response = await axios.post('/category', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateCategory(idOfCategory, data) {
    try {
        const response = await axios.put(`/category/${idOfCategory}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
