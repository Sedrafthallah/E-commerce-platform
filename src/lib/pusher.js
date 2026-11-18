import Pusher from "pusher-js";
import { TOKEN_KEY } from "@/constants/storage";

export function createPusher() {
  return new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,

    wsHost: import.meta.env.VITE_SOKETI_HOST,
    wsPort: 80,
    wssPort: 443,

    forceTLS: true,
    enabledTransports: ["ws", "wss"],
    disableStats: true,

    channelAuthorization: {
      endpoint: `${import.meta.env.VITE_API_URL}broadcasting/auth`,
      transport: "ajax",

      headersProvider: () => {
        const token = localStorage.getItem(TOKEN_KEY);

        return {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          "ngrok-free-app": "true",
        };
      },
    },
  });
}
