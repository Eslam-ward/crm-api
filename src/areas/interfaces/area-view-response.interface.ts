
export interface IAreaViewResponse {
  name: string;
  location: string;
  description?: string;
   stats: {
    totalUnits: number;
    availableUnits: number;
    availabilityPercentage: number;
  };
}
  


