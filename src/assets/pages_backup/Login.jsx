import React from "react";
import "./Login.css";

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="login-subtitle">Please sign in to your account</p>

                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="name@company.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="signin-btn">Sign in</button>
                </form>

                <div className="divider">
                    <span>Or configure with</span>
                </div>

                <div className="social-login">
                    <button className="social-btn google">Google</button>
                    <button className="social-btn facebook">Facebook</button>
                </div>

                <p className="signup-text">
                    Don't have an account? <a href="#">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
