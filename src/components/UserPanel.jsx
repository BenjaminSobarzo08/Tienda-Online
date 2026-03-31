import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserPanel = ({ products }) => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, errors: authErrors } = useAuth();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;

    setProfileData({
      userName: user.userName || "",
      email: user.email || "",
      password: "",
    });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage("");

    try {
      const payload = {
        userName: profileData.userName,
        email: profileData.email,
      };

      if (profileData.password.trim()) {
        payload.password = profileData.password;
      }

      const response = await updateProfile(payload);
      setProfileData((prevData) => ({
        ...prevData,
        password: "",
      }));
      setProfileMessage(response.message);
    } catch (profileError) {
      console.log(profileError.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="profile-card">
        <div className="profile-badge">
          <span>{user?.userName?.slice(0, 1)?.toUpperCase() || "U"}</span>
        </div>

        <div className="profile-copy">
          <p className="eyebrow">Panel de usuario</p>
          <h2>{user?.userName}</h2>
          <p>{user?.email}</p>
        </div>

        <div className="profile-stats">
          <div>
            <strong>{products.length}</strong>
            <span>productos</span>
          </div>
          <div>
            <strong>
              {products.reduce((acc, product) => acc + Number(product.stock || 0), 0)}
            </strong>
            <span>unidades</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <label>
            Nombre de usuario
            <input
              type="text"
              name="userName"
              value={profileData.userName}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
          </label>

          <label>
            Nueva contraseña
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleProfileChange}
              placeholder="Dejar vacio para no cambiarla"
            />
          </label>

          {profileMessage ? (
            <p className="profile-message success">{profileMessage}</p>
          ) : null}

          {authErrors?.length > 0 ? (
            <p className="profile-message error">{authErrors[0]}</p>
          ) : null}

          <div className="profile-actions">
            <button className="primary-btn" type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Guardando..." : "Guardar cambios"}
            </button>
            <button className="ghost-btn" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default UserPanel;
