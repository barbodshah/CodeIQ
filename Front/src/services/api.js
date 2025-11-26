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
export const getCurrentUser = () => API.get("/auth/me");

// Course APIs
export const getAllCourses = () => API.get("/courses");
export const getCourseById = (courseId) => API.get(`/courses/${courseId}`);
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

// Contact APIs
export const sendContactEmail = (data) => API.post("/contact/send", data);

// Purchase APIs
export const purchaseCourse = (courseId) => API.post(`/purchase/${courseId}`);
export const getMyCourses = () => API.get("/purchase/my-courses");
export const checkCourseAccess = (courseId) => API.get(`/purchase/check-access/${courseId}`);

// Admin APIs
export const getAllUsers = () => API.get("/admin/users");
export const getAllCoursesAdmin = () => API.get("/admin/courses");
export const updateUserLogo = (userId, logoUrl) => API.put(`/admin/users/${userId}/logo`, { logo_url: logoUrl });
export const uploadUserLogo = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/admin/users/${userId}/logo/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};