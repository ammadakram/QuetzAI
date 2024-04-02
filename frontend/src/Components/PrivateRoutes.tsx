import { auth } from "../firebase-config";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  return auth.currentUser ? <Outlet /> : <Navigate to={"/login"} />;
}

export default PrivateRoutes;
