import axios from "axios";
import { User, Batch, LabReport, Certificate, ConsumerScanResult, LoginPayload, RegisterPayload } from "../types";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ayurchain_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ayurchain_token");
      // Prevent reload loop if already on login
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post("/auth/login", payload);
    return data.data; // Ensure returned structure: { user, token }
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  },
  getMe: async () => {
    const { data } = await api.get<{ data: User }>("/auth/me");
    return data.data;
  },
};

export const batchAPI = {
  create: async (payload: FormData) => {
    const { data } = await api.post<{ data: { batch: Batch } }>("/batches", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.batch;
  },
  list: async () => {
    const { data } = await api.get<{ data: { batches: Batch[] } }>("/batches");
    return data.data.batches;
  },
  getHistory: async (batchId: string) => {
    const { data } = await api.get<{ data: Batch }>(`/batches/${batchId}/history`);
    return data.data;
  },
  transfer: async (batchId: string, payload: { toUserId: string; notes: string; nextStage: number }) => {
    const { data } = await api.put<{ data: Batch }>(`/batches/${batchId}/transfer`, payload);
    return data.data;
  },
};

export const labAPI = {
  submitReport: async (payload: FormData) => {
    const { data } = await api.post<{ data: { report: LabReport } }>("/labs/reports", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.report;
  },
  getQueue: async () => {
    const { data } = await api.get<{ data: { batches: Batch[] } }>("/labs/queue");
    return data.data.batches;
  },
};

export const certAPI = {
  issue: async (payload: FormData) => {
    const { data } = await api.post<{ data: { certificate: Certificate } }>("/certifications", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.certificate;
  },
  getByBatch: async (batchId: string) => {
    const { data } = await api.get<{ data: { certificates: Certificate[] } }>(`/certifications/batch/${batchId}`);
    return data.data.certificates;
  },
};

export const consumerAPI = {
  verify: async (token: string) => {
    const { data } = await api.get<{ data: ConsumerScanResult }>(`/consumer/verify/${token}`);
    return data.data;
  },
};

export default api;
