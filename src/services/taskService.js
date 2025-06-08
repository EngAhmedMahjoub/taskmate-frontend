import axios from "axios";

const API_BASE = "http://localhost:5276/api/tasks";

export const getTasks = () => axios.get(API_BASE);

export const createTask = (task) => axios.post(API_BASE, task);

export const updateTask = (id, task) => axios.put(`${API_BASE}/${id}`, task);

export const deleteTask = (id) => axios.delete(`${API_BASE}/${id}`);
