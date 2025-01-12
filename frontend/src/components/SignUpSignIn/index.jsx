import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db, auth, provider, doc, setDoc } from "../../firebase";
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
        toast.success("Account created successfully!");

        // Create the user document with their UID
        await createDoc(auth.currentUser.uid);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.code === "auth/invalid-credentials"
          ? "Invalid email or password"
          : error.message;
      toast.error(errorMessage || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Force Google to show account chooser every time
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success("Successfully signed in with Google!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  //Function to create a new doc in Firestore for each new user.
  const createDoc = async (uid) => {
    try {
      // Create a reference to the user document using their UID
      const userDocRef = doc(db, "users", uid);

      // Set the initial data for the user
      await setDoc(userDocRef, {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName || "",
        createdAt: new Date().toISOString(),
        photoURL: auth.currentUser.photoURL || "",
        // Add default user settings/preferences
        preferences: {
          currency: "USD",
          theme: "light",
        },
        // Initialize empty arrays/objects for user data
        transactions: [],
        categories: [],
      });

      toast.success("User profile created successfully!");
    } catch (error) {
      console.error("Error creating user document:", error);
      toast.error("Failed to create user profile");
    }
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

          {/* */}
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
