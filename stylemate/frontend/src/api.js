import axios from "axios";

// Old proxy-based API (used locally or behind a path proxy)
const api = axios.create({
  baseURL: "/choreo-apis/stylemate/app/v1",
  withCredentials: true,
});

// ✅ Choreo full endpoint (Production)
const liveApi = axios.create({
  baseURL: "https://26f6fa57-a5b6-4f2c-936e-3e0cb15a69ba-dev.e1-us-east-azure.choreoapis.dev/stylemate/app/v1.0",
  //withCredentials: true,
});

console.log("Using API base:", api.defaults.baseURL);
console.log("Using LIVE API base:", liveApi.defaults.baseURL);

export { api, liveApi };
