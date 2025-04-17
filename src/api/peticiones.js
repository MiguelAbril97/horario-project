import axios from 'axios'

const clientId = "api-horario";
const clientSecret = "secret_contraseña";

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})

export const obtenerToken = async (usuario, password) => {
  let tokenURL = "http://127.0.0.1:8000/oauth2/token/";
  let items = "";
  let data = {
    'grant_type': 'password',
    'username': usuario,
    'password': password,
    'client_id': clientId,
    'client_secret': clientSecret
  };

  try {
    const response = await axios.post(tokenURL, data);
    if (response.status === 200) {
      items = response.data.access_token;
    }
  } catch (error) {
    console.error('Error al obtener el token:', error);
  }

  return items;
};

export const login = async (token) => {
 try {
    let response = await apiClient.get(`usuario/token/${token}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario por token:', error);
    throw error;
  }

}

// todos los horarios
export const getHorarios = async () => {
  try {
    let response = await apiClient.get('horarios/')
    return response.data
  } catch (error) {
    console.error('Error al obtener los horarios:', error)
    throw error
  }
}

export const getHorarioProfe = async (profesorId) => {
  try {
    let response = await apiClient.get(`horarios/profesor/${profesorId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

export const getProfe = async (profesorId) => {
  try {
    let response = await apiClient.get(`profesor/${profesorId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

export const getProfesores = async () => {
  try {
    let response = await apiClient.get(`profesores/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

// Si necesitas agregar más funciones, puedes seguir este estilo:
// export const createHorario = async (nuevoHorario) => { ... }
// export const deleteHorario = async (id) => { ... }

