
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useBusinessStore } from "../../stores/businessStore";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthStore();
  const { selectedBusinessId } = useBusinessStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!selectedBusinessId) {
    return <Navigate to="/select-business" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;