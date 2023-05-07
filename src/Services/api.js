import axios from 'axios';

const API_URL = 'http://localhost:4000/api';


export const register = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {firstName, lastName, email, password});
        return response.data;
    }
    catch (err) {
        throw new Error(err.response.data.message)
    }
}

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        return response.data
    }
    catch (err) {
        throw new Error(err.response.data.message)
    }
}

export const getUserDetails = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/userDetails`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch (err) {
        throw new Error(err.response.data.message);
    }
}

export const getTodayExpense = async (token, userId) => {
    try {
        const response = await axios.get(`${API_URL}/expenses/${userId}/today`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch(err) {
        throw new Error(err.response.data.message)
    }
}

export const getParticularExpense = async (token, userId, date) => {
    try {
        const response = await axios.post(`${API_URL}/getcurrentexpense/${userId}`, {date}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch(err) {
        throw new Error(err.response.data.message)
    }
}

export const addExpense = async (token, userId, expenseName, expenseDescription, expenseAmount, expenseDate) => {
    try {
        const response = await axios.post(`${API_URL}/addexpense`,{userId, expenseName, expenseDescription, expenseAmount, expenseDate}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        return response.data;
    }
    catch(err) {
        throw new Error(err.response.data.message)
    }
}

export const groupedExpenses = async (userId, token) => {
    try {
        const response = await axios.get(`${API_URL}/expenses/groupbydate/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }
    catch (err) {
        throw new Error(err.response.data.message)
    }
}