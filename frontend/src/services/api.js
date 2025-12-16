// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// export default api;
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://sweet-shop-backend-6em7.onrender.com/api",
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

export default api;
