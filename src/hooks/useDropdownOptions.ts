import { useState, useEffect } from 'react';

interface DropdownOptions {
  airlines: string[];
  cities: string[];
  stops: string[];
  classes: string[];
}

const API_BASE_URL = 'https://flight-price-predictor-app.onrender.com';

export function useDropdownOptions() {
  const [options, setOptions] = useState<DropdownOptions>({
    airlines: [],
    cities: [],
    stops: [],
    classes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/options`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.status}`);
        }
        
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        console.error('Error fetching dropdown options:', err);
        setError(err instanceof Error ? err.message : 'Failed to load options');
        
        // Fallback to default options if API fails
        setOptions({
          airlines: ['IndiGo', 'Air India', 'Jet Airways', 'SpiceJet', 'Multiple carriers', 'GoAir', 'Vistara', 'Air Asia'],
          cities: ['Banglore', 'Kolkata', 'Delhi', 'Chennai', 'Mumbai', 'Hyderabad'],
          stops: ['non-stop', '1 stop', '2 stops', '3 stops', '4 stops'],
          classes: ['Economy', 'Business'],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, isLoading, error };
}