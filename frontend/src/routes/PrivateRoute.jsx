import { Navigate } from "react-router-dom";

/**
 * A component to protect routes based on user authentication and roles.
 * It checks for a user object and token in localStorage.
 *
 * @param {{ children: React.ReactNode, allowedRoles: string[] }} props
 * @returns {React.ReactNode} The child components if authorized, or a redirect.
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    // Safely parse user data from localStorage
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    // If parsing fails, it's best to clear the corrupted data
    localStorage.clear();
  }

  // Check for authentication (user object and token must exist)
  const isAuthenticated = user && token;
  // Check for authorization (user's role must be in the allowed list)
  const isAuthorized = isAuthenticated && allowedRoles.includes(user.role);

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
