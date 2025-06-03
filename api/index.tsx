import axios from 'axios'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWQ0YTEzMS02YWE1LTQ2ZDAtYmUyYy1jMjcwZjkyNDlhOWEiLCJlbWFpbCI6InR1YW4ubmd1eWVua2htdGsyMkBoY211dC5lZHUudm4iLCJpYXQiOjE3NDg5NTc2MTksImV4cCI6MTc0ODk1ODUxOX0._Hn7S2m-mPaBOq6-o7XsAQwYtRKlrIH6gNxzTnQRkPM'

const api = axios.create({
  baseURL: 'http://103.82.133.50:5000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set token before every request
api.interceptors.request.use(
  async (config) => {
    const token = TOKEN
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Optional: Handle 401 to refresh token automatically
// api.interceptors.response.use(...)

export default api
