import axios from './axios.js';


export const RegisterRequest = async (user) => {
  try {
    const response = await axios.post('/api/register', user);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al registrarse');
    } else {
      throw new Error('Error de conexion con el servidor');
    }
  }
};

export const LoginRequest = async (user) => {
  try {
    const response = await axios.post('/api/login', user);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al iniciar sesion');
    } else {
      throw new Error('Error de conexion con el servidor');
    }
  }
};

export const verifyToken = async () => {
  try {
    const response = await axios.get('/api/verifyToken');
    return response.data;
  } catch (error) {
    console.error("Error verificando el token:", error.response?.data || error.message);
    return null;
  }
};

export const UpdateProfileRequest = async (user) => {
  try {
    const response = await axios.put('/api/perfil', user);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al actualizar el perfil');
    } else {
      throw new Error('Error de conexion con el servidor');
    }
  }
};

export const LogoutRequest = async () => {
  try {
    const response = await axios.post('/api/logout');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al cerrar sesion');
    } else {
      throw new Error('Error de conexion con el servidor');
    }
  }
};
