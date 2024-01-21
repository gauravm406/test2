import { useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase.js";
import { Context } from "../../App.jsx";
import styles from "./Register.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [hasLoading, setHasLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(Context);

  const navigate = useNavigate();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  // register user
  const register = async (e) => {
    e.preventDefault();
    try {
      setHasLoading(true);

      const user = await createUserWithEmailAndPassword(auth, email, password);

      if (user) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setHasLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className={styles.main_container}>
      <form onSubmit={register} className={styles.form_container}>
        <h2>Register</h2>
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
          {hasLoading ? "...laoding" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
