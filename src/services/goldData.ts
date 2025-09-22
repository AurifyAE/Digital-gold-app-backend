import { io, Socket } from "socket.io-client";
import dotenv from "dotenv";
import { computeGoldAed } from "../utils/goldAedConversion";

dotenv.config();

const SOCKET_SERVER_URL = process.env.GOLD_DATA_SOCKET_SERVER_URL;
const SECRET_KEY = process.env.GOLD_DATA_SECRET_KEY;

export let goldAedValue: number = 0;

export function connectGoldDataSocket() {
    const symbols = ["GOLD"];
    // Initialize socket connection
    const socket: Socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        query: { secret: SECRET_KEY },
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("Connected to gold data socket server!");
        socket.emit("request-data", symbols);
    });

    // Listen for the gold data event
    socket.on("market-data", (data: any) => {
        goldAedValue = computeGoldAed(data?.bid);
    });

    socket.on("disconnect", () => {
        console.warn("Disconnected from gold data server. Retrying in 5 seconds...");
        setTimeout(connectGoldDataSocket, 5000); // Auto-reconnect
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
    });
}
