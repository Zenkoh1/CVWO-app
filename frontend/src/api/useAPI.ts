import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
const API_URL = process.env.REACT_APP_API_ENDPOINT;

/* General purpose hook for making API calls */
const useAPI = <T>(pathname: string, options?: AxiosRequestConfig) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const fetchAPI = async () => {
    try {
      const response = await axios(`${API_URL}${pathname}`, options);
      const data = await response.data;
      setData(data);
      setLoading(false);
    } catch (error) {
      alert("Error fetching data");
    }
  };

  return { fetchAPI, loading, data };
};

export default useAPI;
