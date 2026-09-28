import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = ["recruiter"] }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const isAuthorized = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!allowedRoles.includes(user.role)) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, allowedRoles]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;