import { io } from "socket.io-client";

const socket = io("/"); // http://localhost:5001 for development

export default socket;