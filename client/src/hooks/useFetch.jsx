import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (searchQuery = "") => {
  const [data, setData] = useState(null);
  const [hasLoading, setHasLoading] = useState(false);
  const [error, setError] = useState(null);

  // api key from env
  const API_KEY = import.meta.env.VITE_REACT_API_KEY;

  const fetchData = async () => {
    try {
      // loader true
      setHasLoading(true);

      // fetch request
      const response = await axios.get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&per_page=200&pretty=true`
      );

      // response data
      setData(response.data);
    } catch (error) {
      // error
      setError(error);
    } finally {
      // loader false
      setHasLoading(false);
    }
  };

  // fetch data
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return [data, hasLoading, error];
};

export default useFetch;
