import axios from 'intercepter/axios';

export async function getDepartment(query = {}, options = {}) {
    try {
        const response = await axios.get('/department', {
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

export async function createDepartment(data) {
    try {
        const response = await axios.post('/department', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateDepartment(idOfDepartment, data) {
    try {
        const response = await axios.put(`/department/${idOfDepartment}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
