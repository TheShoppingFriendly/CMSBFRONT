import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/admin/finance",
  withCredentials: true
});

export const getOverview = () => API.get("/overview");

export const getLedger = (params) =>
  API.get("/ledger", { params });

export const getJourney = (id) =>
  API.get(`/journey/${id}`);

export const getWallet = (wpUserId) =>
  API.get(`/wallet/${wpUserId}`);

export const approvePayout = (data) =>
  API.post("/payout/approve", data);

export const sendPayout = (data) =>
  API.post("/payout/send", data);

export const manualAdjust = (data) =>
  API.post("/manual-adjust", data);
