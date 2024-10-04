import Router from "./routes/Router";
import Echo from "laravel-echo";

function App() {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "app-key",
    wsHost: "ws.arkaya.site",
    wsPort: 6002,
    wssPort: 6002,
    forceTLS: true,
    encrypted: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
