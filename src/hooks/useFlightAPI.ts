import { useState } from 'react';
import { FlightSearchData } from '@/components/FlightSearchForm';
import { FlightResult } from '@/components/FlightResults';

// API configuration - update this with your Render app URL
const API_BASE_URL = 'https://flight-price-predictor-app-7jh5.onrender.com/'; // Replace with your actual Render URL

// Map time to time-of-day category (same logic as your Python app)
const mapTimeToCategory = (timeStr: string): string | null => {
  try {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour >= 5 && hour < 8) return 'Early Morning';
    if (hour >= 8 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 16) return 'Afternoon';
    if (hour >= 16 && hour < 20) return 'Evening';
    if (hour >= 20 && hour < 24) return 'Night';
    return 'Late Night';
  } catch {
    return null;
  }
};

export function useFlightAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FlightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predictPrice = async (formData: FlightSearchData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate all required fields
      if (!formData.airline || !formData.source_city || !formData.departure_time || 
          !formData.stops || !formData.arrival_time || !formData.destination_city || 
          !formData.class || !formData.departure_date) {
        throw new Error('Please fill in all the fields before predicting.');
      }

      // Calculate days left
      const today = new Date();
      const departureDate = new Date(formData.departure_date);
      const daysLeft = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft < 0 || daysLeft > 60) {
        throw new Error('Departure date must be within the next 60 days.');
      }

      // Map times to categories
      const depCategory = mapTimeToCategory(formData.departure_time);
      const arrCategory = mapTimeToCategory(formData.arrival_time);

      if (!depCategory || !arrCategory) {
        throw new Error('Invalid time selected.');
      }

      // Prepare the payload for your Dash app
      const payload = {
        airline: formData.airline,
        source_city: formData.source_city,
        departure_time: depCategory,
        stops: formData.stops,
        arrival_time: arrCategory,
        destination_city: formData.destination_city,
        class: formData.class,
        duration: formData.duration,
        days_left: daysLeft,
      };

      // Make actual API call to your Dash app
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const apiResult = await response.json();
      setResult(apiResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Flight prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    predictPrice,
    isLoading,
    result,
    error,
    clearResults: () => {
      setResult(null);
      setError(null);
    },
  };
}

/*
IMPORTANT: API Integration Instructions

To connect this frontend to your Dash app, you have a few options:

1. **Add REST API endpoints to your Dash app:**
   Add these routes to your Dash app:

   ```python
   from flask import request, jsonify

   @app.server.route('/api/predict', methods=['POST'])
   def api_predict():
       data = request.get_json()
       
       # Use your existing prediction logic here
       user_input = pd.DataFrame({
           'airline': [data['airline']],
           'source_city': [data['source_city']],
           'departure_time': [data['departure_time']],
           'stops': [data['stops']],
           'arrival_time': [data['arrival_time']],
           'destination_city': [data['destination_city']],
           'class': [data['class']],
           'duration': [data['duration']],
           'days_left': [data['days_left']]
       })
       
       predicted_price = round(model.predict(user_input)[0], 2)
       
       # Get matching flights logic here
       # ...
       
       return jsonify({
           'predicted_price': predicted_price,
           'matching_flights': matching_flights_list
       })
   ```

2. **Create a separate API service:**
   Create a FastAPI or Flask app that loads your model and serves predictions.

3. **Update the API_BASE_URL:**
   Replace the placeholder URL with your actual Render app URL.

The mock implementation above will work for testing the UI.
*/
