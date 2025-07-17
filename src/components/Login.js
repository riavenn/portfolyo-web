import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Admin bilgileri (gerçek uygulamada backend'den gelecek)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basit doğrulama simülasyonu
    setTimeout(() => {
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        // Başarılı giriş
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminUser", credentials.username);
        navigate("/admin");
      } else {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Paneli</h1>
            <p>Giriş yaparak yönetim paneline erişin</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Kullanıcı Adı</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adınızı girin"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Şifrenizi girin"
                required
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Demo Bilgileri:</p>
            <p><strong>Kullanıcı Adı:</strong> admin</p>
            <p><strong>Şifre:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;