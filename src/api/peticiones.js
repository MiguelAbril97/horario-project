import axios from 'axios';

const clientId = 'api-horario';
const clientSecret = 'secret_contraseña';

// Instancia básica sin token
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en todas las peticiones
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Función para almacenar o limpiar el token
export const setAuthToken = token => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

// Función para obtener token OAuth2
export const obtenerToken = async (usuario, password) => {
  const tokenURL = 'http://127.0.0.1:8000/oauth2/token/';

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', usuario);
  params.append('password', password);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    const response = await axios.post(tokenURL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      setAuthToken(access_token);
      localStorage.setItem('refresh_token', refresh_token);
      return access_token;
    }
  } catch (error) {
    console.error('❌ Error al obtener el token:', error.response?.data || error);
    return null;
  }
};

// Función para obtener datos del usuario autenticado
export const login = async (token) => {
  try {
    const response = await apiClient.get(`usuario/token/${token}/`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener el usuario:', error.response?.data || error);
    throw error;
  }
};

// Función para cerrar sesión (logout)
export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    const revokeURL = 'http://127.0.0.1:8000/oauth2/revoke_token/';
    const params = new URLSearchParams();
    params.append('token', refreshToken);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
      await axios.post(revokeURL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err) {
      console.error('❌ Error al revocar el token:', err.response?.data || err);
    }
  }
  setAuthToken(null);
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('usuario');

};

// Resto de peticiones usando apiClient
export const getHorarios = async () => {
  const response = await apiClient.get('horarios/');
  return response.data;
};

export const getHorarioProfe = async (profesorId) => {
  const response = await apiClient.get(`horarios/profesor/${profesorId}/`);
  return response.data;
};

export const getHorarioProfeDia = async (profesorId,dia) => {
  const response = await apiClient.get(`horarios/profesor/${profesorId}/${dia}/`);
  return response.data;
};

export const getHorariosDia = async (dia) => {
  const response = await apiClient.get(`horarios/dia/${dia}/`);
  return response.data;
} 

export const getProfe = async (profesorId) => {
  const response = await apiClient.get(`profesor/${profesorId}/`);
  return response.data;
};

export const getProfesores = async () => {
  const response = await apiClient.get('profesores/');
  return response.data;
};

export const getAusencias = async () => {
  const response = await apiClient.get(`ausencias/`);
  return response.data;
};

export const getGuardias = async () => {
  const response = await apiClient.get(`horarios/guardias/`);
  return response.data;
}

export const getAusenciasProfe = async (profesorId) => {
  const response = await apiClient.get(`ausencias/profesor/${profesorId}/`);
  return response.data;
};

export const getAusencia = async (ausenciaId) => {
  const response = await apiClient.get(`ausencia/${ausenciaId}/`);
  return response.data;
};

export const getAusenciasFecha = async (fecha) => {
  const response = await apiClient.get(`ausencias/fecha/${fecha}/`);
  return response.data;
};

export const createAusencia = async (data) => {
  const response = await apiClient.post(`ausencias/crear/`, data);
  return response.data;
};

export const setAusencia = async (data, ausenciaId) => {
  const response = await apiClient.post(`ausencias/editar/${ausenciaId}/`, data);
  return response.data;
};

export const deleteAusencia = async (ausenciaId) => {
  const response = await apiClient.delete(`ausencias/eliminar/${ausenciaId}/`);
  return response.data;
};


export const crearUsuario = async (data) => {
  const response = await apiClient.post(`usuario/crear/`, data);
  return response.data;
}

export const editarUsuario = async (data, id_usuario) => {
  const response = await apiClient.put(`usuario/editar/${id_usuario}/`, data);
  return response.data;
}

export const eliminarUsuario = async (id_usuario) => {
  const response = await apiClient.delete(`usuario/eliminar/${id_usuario}/`);
  return response.data;
}

export const subirHorario = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('horarios/subir/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}