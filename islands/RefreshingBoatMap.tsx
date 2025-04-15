import { LocationResponse, MapBounds } from "../types/api.ts";
import BoatMap from "./Map.tsx";

export default function RefreshingBoatMap({ apiUrl }: { apiUrl: string }) {
  async function fetchLocationData(
    bounds: MapBounds,
  ): Promise<LocationResponse> {
    try {
      const url = new URL("/api/ais", apiUrl);
      url.searchParams.append("north", `${bounds.north}`);
      url.searchParams.append("east", `${bounds.east}`);
      url.searchParams.append("west", `${bounds.west}`);
      url.searchParams.append("south", `${bounds.south}`);

      const response = await fetch(url);
      const result = await response.json() as LocationResponse;
      return result;
    } catch (e) {
      console.log("something bad happened!");
      console.log(e);
      return { positions: [] };
    }
  }

  return <BoatMap refreshData={fetchLocationData}></BoatMap>;
}
