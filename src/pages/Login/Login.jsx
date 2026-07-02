import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@hooks/useAuth";
import { ROUTES } from "@constants";
import "./Login.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_EMAIL = "admin@example.com";
const DEMO_PASSWORD = "Admin@123";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formValues) => {
    try {
      await login(formValues.email, formValues.password);
      toast.success("Logged in successfully");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  const handleUseDemoAccount = () => {
    setValue("email", DEMO_EMAIL, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
    toast.success("Demo credentials loaded.");
  };

  return (
    <div className="login">
      <h1 className="login_title">Welcome Back</h1>
      <p className="login_subtitle">Sign in to manage event check-ins</p>

      <form className="login_form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="login_field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: EMAIL_PATTERN,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <span className="login_error">{errors.email.message}</span>
          )}
        </div>

        <div className="login_field">
          <label htmlFor="password">Password</label>
          <div className="login_password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="login_toggle-visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <span className="login_error">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" className="login_submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          className="login_demo-btn"
          onClick={handleUseDemoAccount}
          disabled={isSubmitting}
        >
          Use Demo Account
        </button>
      </form>
    </div>
  );
};

export default Login;
