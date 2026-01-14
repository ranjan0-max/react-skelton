import axios from 'intercepter/axios';

export async function uploadFile(data) {
    try {
        const response = await axios.post('/fileOperation/formWeb', data);
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function deleteFile(data) {
    try {
        const response = await axios.delete('/fileOperation/delete/file', { data });
        return response;
    } catch (error) {
        return error.data.message;
    }
}

export async function getFileLink(fileName) {
    try {
        const response = await axios.get('/fileOperation', {
            params: {
                fileName: fileName
            }
        });
        return response.data.data;
    } catch (error) {
        return error.data.message;
    }
}

export async function uploadExcelFile(data) {
    try {
        const response = await axios.post('/fileOperation/excel', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        return error.data.message;
    }
}
