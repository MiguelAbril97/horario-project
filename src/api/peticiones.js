import axios from 'axios'

// URL base Django
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    //tokens: 'Authorization': `Bearer ${token}`
  }
})

// todos los horarios
export const getHorarios = async () => {
  try {
    const response = await apiClient.get('horarios/')
    return response.data
  } catch (error) {
    console.error('Error al obtener los horarios:', error)
    throw error
  }
}

export const getHorarioProfe = async (profesorId) => {
  try {
    const response = await apiClient.get(`horarios/profesor/${profesorId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

export const getProfe = async (profesorId) => {
  try {
    const response = await apiClient.get(`profesor/${profesorId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

export const getProfesores = async () => {
  try {
    const response = await apiClient.get(`profesores/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los horarios del profesor:', error);
    throw error
  }
}

// Si necesitas agregar más funciones, puedes seguir este estilo:
// export const createHorario = async (nuevoHorario) => { ... }
// export const deleteHorario = async (id) => { ... }

