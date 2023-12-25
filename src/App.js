import Router from "./routes/Router";
import { useEffect } from "react";
import Echo from "laravel-echo";

function App() {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "b97c818f3ea7eb3a15fe",
    cluster: "ap1",
    forceTLS: true,
  });

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
