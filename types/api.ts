export interface ShipPosition{
    lon: number,
    lat: number,
    userId: number,
    trueHeading: number, 
    sog: number,
    lastSeen:string,
    static:{
        info?: {
            call_sign:string,
            ship_type: string,
            name:string
        }
    }
}

export interface LocationResponse {
  positions: ShipPosition[]  
};

export interface MapBounds {
    west: number;
    east: number;
    north: number;
    south: number;
  };