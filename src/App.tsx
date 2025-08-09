import { useCookies } from "react-cookie"
import { AuthRoute, DashboardRoutes } from "./routes";

const App = () => {
  const [cookies] = useCookies(['accessToken']);
  return (cookies.accessToken ? <DashboardRoutes /> : <AuthRoute />

  )
}

export default App
