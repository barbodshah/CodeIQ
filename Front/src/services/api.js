// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // Change if backend URL is different
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Course APIs
export const getAllCourses = () => API.get("/courses");
export const getCourseSessions = (courseId) => API.get(`/courses/${courseId}/sessions`);

// Session APIs
export const getSessionById = (sessionId) => API.get(`/sessions/${sessionId}`);

// Question APIs
export const getQuestionById = (questionId) => API.get(`/judge/question/${questionId}`);

// Submit APIs
export const submitCode = (questionId, sourceCode, languageId = 71) => 
  API.post(`/judge/submit/${questionId}`, {
    source_code: sourceCode,
    language_id: languageId
  });