import Router from "./routes/Router";
import Echo from "laravel-echo";

function App() {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "app-key",
    cluster: "ap1",
    wsHost: "ws.tokoevent.id",
    wsPort: 6001,
    wssPort: 6002,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
  });

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
