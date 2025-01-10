import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth"; //Tracks the authentication state from Firebase
import "./styles.css";

const Header = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  //Returns the current user object if logged in, null if not
  //Automatically updates when auth state changes

  // Redirect to the dashboard if user is authenticated
  //no need to log in again if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  // Check if we're on the sign-in/sign-up page
  const isAuthPage = location.pathname === "/";

  async function logout() {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoading(true);
      try {
        await signOut(auth);
        navigate("/"); // Redirect to sign-in page after logout
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <span className="logo">💰</span>
          <h1 className="app-name">SpendSense</h1>
        </div>

        {!isAuthPage && (
          <button className="logout-button" onClick={logout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
