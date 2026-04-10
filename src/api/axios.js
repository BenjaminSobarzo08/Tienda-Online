import axios from "axios";
import { API_URL } from "./config.js";

const instancia = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export default instancia
