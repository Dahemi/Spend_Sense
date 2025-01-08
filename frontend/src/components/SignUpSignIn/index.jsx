import { useState } from "react";
import { auth, provider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import "./styles.css";

function SignUpSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true); //*IMPORTANT*/

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="auth-header">
          <h1>Welcome to SpendSense</h1>
          <p>{isSignUp ? "Create a new account" : "Sign in to your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            state={email}
            setState={setEmail}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            state={password}
            setState={setPassword}
            required
          />

          {/*   */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          className="google-btn"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        <p className="toggle-mode">
          {/*Ternary operator to display the correct text based on the isSignUp state*/}
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          {/*Clicking the toggle button will switch the isSignUp state and display the correct form content*/}
          <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUpSignIn;
