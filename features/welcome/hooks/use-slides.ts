import { useState, useEffect } from 'react';
import { welcomeAPI } from '../api/welcome.api';
import type { Slide } from '../types';

export const useSlides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await welcomeAPI.getSlides();
        
        if (response.success && response.data) {
          setSlides(response.data);
        } else {
          setError(response.message || 'Failed to load slides');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch slides');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  return { slides, isLoading, error };
};

