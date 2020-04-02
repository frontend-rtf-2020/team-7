import axios from 'axios'

const api = axios.create({
    baseURL: 'https://temp-messenger.azurewebsites.net/api',
});

export const createUser = payload => api.post(`/registration`, payload);
export const getUsersByUsername = username => api.get(`/users/${username}`);
export const updateUserById = (id, payload) => api.put(`/update/${id}`, payload);
export const login = payload => api.post(`/login`, payload);
export const logout = () => api.post(`/logout`);
export const getUserById = id => api.get(`/user/${id}`);

const apis = {
    createUser,
    getUsersByUsername,
    updateUserById,
    login,
    logout,
    getUserById,
};

export default apis