import axios from 'intercepter/axios';

export async function getUser(query = {}, options = {}) {
    try {
        const response = await axios.get('/user', {
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

export async function createUser(data) {
    try {
        const response = await axios.post('/user', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateUser(idOfUser, data) {
    try {
        const response = await axios.put(`/user/${idOfUser}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateUserMenuConfig(data) {
    try {
        const response = await axios.post('/user/updateMenuConfig', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function getUserMenuConfig(query = {}) {
    try {
        const response = await axios.get('/user/menuConfig', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}
