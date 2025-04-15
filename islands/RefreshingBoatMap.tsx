import BoatMap from "./Map.tsx";
import { useEffect, useRef } from "preact/hooks";
import { LocationResponse, MapBounds, ShipPosition } from "../types/api.ts";
import { effect, untracked, useSignal } from "@preact/signals";

export default function RefreshingBoatMap({ apiUrl }: { apiUrl: string }) {
  const mapBounds = useRef<MapBounds>({
    north: 62.5,
    south: 62.0,
    east: 4.8,
    west: 5.3,
  });

  const mapBoundsS = useSignal(mapBounds.current);
  const shipLocations = useSignal<ShipPosition[]>([]);

  // refresh data continuously
  useEffect(() => {
    function refresh() {
      refreshData(apiUrl, mapBounds.current)
        .then((v) => {
          shipLocations.value = v.positions;
        });
    }

    refresh();
    const intervalId = setInterval(refresh, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // do refresh when bounds change
  effect(() => {
    mapBounds.current = mapBoundsS.value;
    refreshData(apiUrl, mapBounds.current)
      .then((v) => {
        untracked(() => {
          shipLocations.value = v.positions;
        });
      }).finally(() => {
      });
  });

  return (
    <BoatMap
      shipLocations={shipLocations}
      boundsUpdated={(v) => {
        mapBoundsS.value = v;
      }}
    >
    </BoatMap>
  );
}

async function refreshData(
  apiUrl: string,
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
