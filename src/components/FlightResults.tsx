import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plane, Clock, IndianRupee, AlertCircle } from 'lucide-react';

export interface FlightResult {
  predicted_price: number;
  matching_flights: Array<{
    airline: string;
    flight: string;
    duration: number;
  }>;
}

interface FlightResultsProps {
  result: FlightResult | null;
  error: string | null;
}

export function FlightResults({ result, error }: FlightResultsProps) {
  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-card border-destructive">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Price Result */}
      <Card className="shadow-result">
        <CardHeader className="bg-gradient-sky text-sky-navy rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <IndianRupee className="w-6 h-6" />
            Predicted Price
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              ₹{result.predicted_price.toLocaleString('en-IN')}
            </div>
            <p className="text-muted-foreground">
              Estimated price for your selected flight
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Matching Flights */}
      {result.matching_flights && result.matching_flights.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Top Matching Flights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {result.matching_flights.map((flight, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plane className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{flight.airline}</div>
                        <div className="text-sm text-muted-foreground">
                          Flight {flight.flight}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(flight.duration)}
                      </Badge>
                    </div>
                  </div>
                  {index < result.matching_flights.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result.matching_flights && result.matching_flights.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">
              No matching flights found for your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}