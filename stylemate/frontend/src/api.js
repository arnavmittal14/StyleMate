import axios from "axios";

const apiUrl = "/choreo-apis/stylemate/app/v1";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})
export { api, apiUrl };
