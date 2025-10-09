import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODk1YTM2NzQzYzIwNzJjMDY1OTU3YzdjOTk4YmNmOCIsIm5iZiI6MTc1OTk4MzIyNS4yMjcsInN1YiI6IjY4ZTczNjc5MDQwNWRiNDIyZDVmNWZmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KZFQG10ak3omcmWSsfAmTxlaAw5mqTLHSLxfzsg0Iyk";

const dbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default dbApi;
