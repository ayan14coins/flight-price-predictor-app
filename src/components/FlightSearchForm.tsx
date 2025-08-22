import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plane, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

export interface FlightSearchData {
  airline: string;
  source_city: string;
  departure_time: string;
  stops: string;
  arrival_time: string;
  destination_city: string;
  class: string;
  duration: number;
  departure_date: Date | null;
}

interface FlightSearchFormProps {
  onSearch: (data: FlightSearchData) => void;
  isLoading: boolean;
}

// Mock data - replace with your actual data
const airlines = ['IndiGo', 'SpiceJet', 'Air India', 'GoAir', 'Vistara', 'AirAsia'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
const stops = ['zero', 'one', 'two_or_more'];
const classes = ['Economy', 'Business'];

// Generate time options (every 30 minutes)
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export function FlightSearchForm({ onSearch, isLoading }: FlightSearchFormProps) {
  const { options, isLoading: optionsLoading } = useDropdownOptions();
  const [formData, setFormData] = useState<FlightSearchData>({
    airline: '',
    source_city: '',
    departure_time: '',
    stops: '',
    arrival_time: '',
    destination_city: '',
    class: '',
    duration: 2.5,
    departure_date: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const isFormValid = () => {
    return (
      formData.airline &&
      formData.source_city &&
      formData.departure_time &&
      formData.stops &&
      formData.arrival_time &&
      formData.destination_city &&
      formData.class &&
      formData.departure_date
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-flight">
      <CardHeader className="bg-gradient-hero text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Plane className="w-6 h-6" />
          Flight Price Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source_city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                From
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, source_city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source city" />
                </SelectTrigger>
                 <SelectContent>
                   {options.cities.map((city) => (
                     <SelectItem key={city} value={city}>
                       {city}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination_city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                To
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, destination_city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                 <SelectContent>
                   {options.cities.map((city) => (
                     <SelectItem key={city} value={city}>
                       {city}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.departure_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departure_date ? format(formData.departure_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.departure_date || undefined}
                    onSelect={(date) => setFormData({ ...formData, departure_date: date || null })}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Departure Time
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, departure_time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Arrival Time
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, arrival_time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flight Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Airline</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, airline: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select airline" />
                  </SelectTrigger>
                   <SelectContent>
                     {options.airlines.map((airline) => (
                       <SelectItem key={airline} value={airline}>
                         {airline}
                       </SelectItem>
                     ))}
                   </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stops</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, stops: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stops" />
                  </SelectTrigger>
                   <SelectContent>
                     {options.stops.map((stop) => (
                       <SelectItem key={stop} value={stop}>
                         {stop === 'non-stop' ? 'Non-stop' : 
                          stop === '1 stop' ? '1 Stop' : 
                          stop === '2 stops' ? '2 Stops' :
                          stop === '3 stops' ? '3 Stops' :
                          stop === '4 stops' ? '4 Stops' : stop}
                       </SelectItem>
                     ))}
                   </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <RadioGroup
                  value={formData.class}
                  onValueChange={(value) => setFormData({ ...formData, class: value })}
                  className="flex gap-4"
                >
                 {options.classes.map((classType) => (
                   <div key={classType} className="flex items-center space-x-2">
                     <RadioGroupItem value={classType} id={classType} />
                     <Label htmlFor={classType}>{classType}</Label>
                   </div>
                 ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Duration: {formData.duration.toFixed(1)} hours</Label>
                <Slider
                  value={[formData.duration]}
                  onValueChange={([value]) => setFormData({ ...formData, duration: value })}
                  max={50}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="predict"
            size="lg"
            className="w-full md:w-auto md:px-12"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Predicting...' : 'Predict Flight Price'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}