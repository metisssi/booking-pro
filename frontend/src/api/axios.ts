import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },

    (error) => {
        if(error.response?.status === 401) {
            // Токен невалидный или истёк - чистим localStorage
             localStorage.removeItem('token');
             localStorage.removeItem('user');
             window.location.href = '/login'
        }
        

        return Promise.reject(error)
    }
)

export default axiosInstance;