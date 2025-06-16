import axios from "axios"

const api = axios.create({
  baseURL: "https://admin-demo.tripcater.com/api", // update per environment
})

export const setupInterceptors = (router: any) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status
      console.error("API Error:", error)

      if (error.message === "Network Error") {
        router.push("/error")
      }

      if (status === 401) {
        localStorage.removeItem("accessToken")
        router.push("/login")
      }

      if (status === 403) router.push("/403")
      if (status === 405 || status === 500) router.push("/error")

      return Promise.reject(error)
    }
  )

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}

export default api
