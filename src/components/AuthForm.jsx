import { useState } from "react";
import { login as loginUser, register as registerUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const AuthForm = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(email, password);
      login(data.token, email);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-500 mt-2"
        >
          {isLogin ? "Need an account? Register" : "Already have one? Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
