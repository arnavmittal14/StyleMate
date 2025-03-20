import axios from "axios";

const apiUrl = "/choreo-apis/stylemate/app/v1";
console.log("Using API URL:", apiUrl);

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true, 
});

export { api, apiUrl };