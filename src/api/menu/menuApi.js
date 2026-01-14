import axios from 'intercepter/axios';

export async function getUserMenu(query = {}) {
    try {
        const response = await axios.get('/menu/menuByConfig', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function getMenu(query = {}) {
    try {
        const response = await axios.get('/menu', {
            params: {
                ...query
            }
        });
        return response.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function getClientMenuList(query = {}) {
    try {
        const response = await axios.get('/menu/clientMenuList', {
            params: {
                ...query
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function createMenu(data) {
    try {
        const response = await axios.post('/menu', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function updateMenu(idOfMenu, data) {
    try {
        const response = await axios.put(`/menu/${idOfMenu}`, data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}
