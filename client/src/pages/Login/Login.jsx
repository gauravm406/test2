import { useState, useContext } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import { Context } from "../../App.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.module.css";

const Login = () => {
  const [hasLoading, setHasLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(Context);

  const navigate = useNavigate();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  // register user
  const login = async (e) => {
    e.preventDefault();
    try {
      setHasLoading(true);

      const user = await signInWithEmailAndPassword(auth, email, password);

      if (user) {
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setHasLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleGuestLogin = () => {
    setEmail("johndoe@gmail.com");
    setPassword("123456");
    login();
  };

  return (
    <div className={styles.main_container}>
      <form onSubmit={login} className={styles.form_container}>
        <h3>Login</h3>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={hasLoading}>
          {hasLoading ? "...loading" : "Login"}
        </button>
        <button onClick={handleGuestLogin}>Guest Login</button>
      </form>
    </div>
  );
};

export default Login;
