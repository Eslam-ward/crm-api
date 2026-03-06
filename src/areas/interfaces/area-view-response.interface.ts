export interface AreaViewResponse {
  name: string;
  location: string;
  type: string;
  description?: string;
  group: string;

  totalUnits: number;
  availableUnits: number;
  availabilityRate: number;
}