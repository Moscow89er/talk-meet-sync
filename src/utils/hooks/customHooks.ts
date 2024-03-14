import { useState, useEffect, useCallback } from "react";
import { ApiMethod, ApiError } from "../types/apiTypes";

// import mainApi from "";

function useFetchMainApi<TParams, TResponse>(
    method: ApiMethod<TParams, TResponse>,
    params: TParams
  ) {
    const [data, setData] = useState<TResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
  
    const fetchData = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await method(params);
        setData(response);
      } catch (err) {
        setError(err as ApiError); // Предполагается, что ошибка будет соответствовать интерфейсу ApiError
      } finally {
        setIsLoading(false);
      }
    }, [method, params]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    return { data, isLoading, error };
  }
  
  export default useFetchMainApi;