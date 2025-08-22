import React from 'react';
import { FlightSearchForm, FlightSearchData } from '@/components/FlightSearchForm';
import { FlightResults } from '@/components/FlightResults';
import { useFlightAPI } from '@/hooks/useFlightAPI';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { predictPrice, isLoading, result, error, clearResults } = useFlightAPI();
  const { toast } = useToast();

  const handleSearch = async (formData: FlightSearchData) => {
    clearResults();
    await predictPrice(formData);
    
    if (error) {
      toast({
        title: "Prediction Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              ✈️ Flight Price Predictor
            </h1>
            <p className="text-xl text-primary/80 max-w-2xl mx-auto">
              Get accurate flight price predictions powered by machine learning
            </p>
          </div>

          {/* Search Form */}
          <FlightSearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Results */}
          <FlightResults result={result} error={error} />

          {/* Footer */}
          <footer className="text-center text-primary/60 text-sm">
            🚀 Built with React & TypeScript | Powered by flight_price_model1.pkl
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
