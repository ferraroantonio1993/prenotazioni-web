import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { Property } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: string;
  onSelect: (id: string) => void;
  onReload: () => void;
  loading: boolean;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  selectedProperty,
  onSelect,
  onReload,
  loading,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
    <div className="w-full space-y-2 sm:max-w-md">
      <Label className="text-sm font-medium">Property</Label>
      <Select value={selectedProperty} onValueChange={onSelect} disabled={loading}>
        <SelectTrigger className="bg-background/50 h-10 w-full md:h-11">
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex shrink-0 justify-start sm:ml-auto sm:justify-end">
      <Button
        variant="outline"
        onClick={onReload}
        disabled={loading}
        className="h-10 w-full gap-2 px-6 sm:w-auto md:h-11"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
        {loading ? 'Loading...' : 'Reload'}
      </Button>
    </div>
  </div>
);

export default PropertySelector;
