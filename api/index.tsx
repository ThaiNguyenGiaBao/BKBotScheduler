import axios from 'axios'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYWQ0YTEzMS02YWE1LTQ2ZDAtYmUyYy1jMjcwZjkyNDlhOWEiLCJlbWFpbCI6InR1YW4ubmd1eWVua2htdGsyMkBoY211dC5lZHUudm4iLCJpYXQiOjE3NDg5NjAyNjEsImV4cCI6MTc0ODk2Mzg2MX0.8Hs7AQ0TXaCBvOwDf7ppGbf8B0Gns1VKAapkWnoRj5k'

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
