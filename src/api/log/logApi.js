import axios from 'intercepter/axios';

export async function getLogFiles(options = {}) {
    try {
        const response = await axios.get('logs/files', { signal: options.signal });
        return response.data;
    } catch (error) {
        return error?.data || error;
    }
}

export async function getLogFileDetail(path, options = {}) {
    try {
        const response = await axios.get('logs/detail', {
            params: { path },
            signal: options.signal
        });
        return response.data;
    } catch (error) {
        return error?.data || error;
    }
}