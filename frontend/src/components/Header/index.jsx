import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./styles.css";

const Header = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function logout() {
    {
      /*setLoading(true);
    try {
      await signOut(auth);
      navigate("/"); // Redirect to sign-in page after logout
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }*/
    }
    alert("Logout button clicked");
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <span className="logo">💰</span>
          <h1 className="app-name">SpendSense</h1>
        </div>

        <button className="logout-button" onClick={logout} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default Header;
