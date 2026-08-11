import Hub from "./components/Hub";
import SecretaryDashboard from "./components/SecretaryDashboard";

export default function App() {
  const isSecretaryRoute = window.location.pathname.replace(/\/+$/, "") === "/secretary";
  return isSecretaryRoute ? <SecretaryDashboard /> : <Hub />;
}
