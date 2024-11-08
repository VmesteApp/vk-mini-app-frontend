import { useEffect, useState } from "react";
import api from "../network";
import { IPulse } from "../types";

export const usePulse = (pulseID: number) => {
  const [pulse, setPulse] = useState<IPulse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchPulse = async () => {
      if (loading) return;
      setLoading(true);

      api
        .get<IPulse>(`/content/pulses/${pulseID}`)
        .then((response) => {
          if (response.status === 200) {
            setPulse(response.data);
          }
        })
        .catch((error) =>
          setErrorMessage(
            error.response?.data?.message ||
              error.response?.data?.detail ||
              "Unknown error"
          )
        )
        .finally(() => setLoading(false));
    };

    fetchPulse();
  }, [pulseID]);

  return {
    errorMessage,
    pulse,
    loading,
  };
};
