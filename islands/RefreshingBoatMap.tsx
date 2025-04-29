import { JSX } from "preact";
import BoatMap from "./Map.tsx";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  LocationResponse,
  MapBounds,
  ShipPosition,
  Trails,
} from "../types/api.ts";
import ShipInfo from "../components/ShipInfo.tsx";

export default function RefreshingBoatMap({ apiUrl }: { apiUrl: string }) {
  const mapBounds = useRef<MapBounds>({
    north: 62.5,
    south: 62.0,
    east: 4.8,
    west: 5.3,
  });

  const [trailLengthHours, setTrailLengthHours] = useState(12)
  const [shipLocations, setShipLocations] = useState<ShipPosition[]>([]);
  const [selectedUserIds, setSelectedUserids] = useState<string[]>([]);
  const [selectedShips, setSelectedShips] = useState<ShipPosition[]>([]);
  const [trails, setTrails] = useState<Trails>({});

  useEffect(() => {
    const url = new URL(globalThis.window.location.href);
    setTimeout(() => {
      setSelectedUserids(url.searchParams.getAll("u"));
    }, 200);
  }, []);

  useEffect(() => {
    fetchTrails(apiUrl, selectedUserIds, trailLengthHours).then((t) => {
      setTrails(t);
    });
  }, [selectedUserIds, trailLengthHours]);

  useEffect(() => {
    const selectedShipsUpdate: ShipPosition[] = [];
    selectedUserIds.forEach((u) => {
      const aShip = shipLocations.filter((s) => s.userId === +u);
      if (aShip.length > 0) {
        selectedShipsUpdate.push(aShip[0]);
      }
    });
    setSelectedShips(selectedShipsUpdate);
  }, [selectedUserIds, shipLocations]);

  // refresh data continuously
  useEffect(() => {
    function refresh() {
      fetchMapPositions(apiUrl, mapBounds.current)
        .then((v) => {
          setShipLocations(v.positions);
        });
    }
    const intervalId = setInterval(refresh, 10000);
    return () => clearInterval(intervalId);
  }, [19899]);

  // do refresh when bounds change
  const boundsUpdated = (bounds: MapBounds) => {
    mapBounds.current = bounds;
    fetchMapPositions(apiUrl, bounds)
      .then((v) => {
        setShipLocations(v.positions);
      });
  };

  const toggleUserIdSelect = (userId: string) => {
    const currentUrl = new URL(globalThis.window.location.href);
    const userIds = currentUrl.searchParams.getAll("u");

    let newSelectedUserIds;
    if (userIds.includes(userId)) {
      newSelectedUserIds = userIds.filter((id) => id !== userId);
    } else {
      newSelectedUserIds = [...userIds, userId];
    }
    setSelectedUserids(newSelectedUserIds);

    // Update URL parameters
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("u");
    newSelectedUserIds.forEach((id) => url.searchParams.append("u", id));
    globalThis.history.pushState({}, "", url);
  };

  function clearSelection() {
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("u");
    globalThis.history.pushState({}, "", url);

    setSelectedUserids([]);
  }

  function prettyTrailLength(trailLengthHours: number): string {
    if(trailLengthHours< 24){
      return `${trailLengthHours} timer`;
    } else {
      const days = Math.floor(trailLengthHours/24);
      const hours = trailLengthHours %24;
      return `${days} dager ${hours} timer`
    }
  }

  return (
    <div>
      <BoatMap
        shipLocations={shipLocations}
        trails={trails}
        toggleUserId={toggleUserIdSelect}
        boundsUpdated={boundsUpdated}
      >
      </BoatMap>
      {selectedShips.length > 0 &&
        (
          <div className="absolute bottom-1 left-1 bg-slate-200 rounded-md p-2">
            <div className="flex">
              <ShipInfo ships={selectedShips} />
              <div className="cursor-pointer ml-1" onClick={clearSelection}>
                ❌
              </div>
            </div>
            <div className="flex">
              <label for="durationSelect" className="pr-2">Sporlengde</label>
              <input
                name="durationSelect"
                className="w-max"
                type="range"
                min="1"
                max="180"
                step="1"
                value={trailLengthHours}
                onChange={(e) => {setTrailLengthHours(e.target.value)}}
              />
              <div className="p-1">{prettyTrailLength(trailLengthHours)}</div>
            </div>
          </div>
        )}
    </div>
  );
}

async function fetchTrails(apiUrl: string, userIds: string[], trailLenghtHours:number): Promise<Trails> {
  if (userIds.length === 0) {
    return {};
  }
  try {
    const url = new URL("/api/trails", apiUrl);
    userIds.forEach((u) => url.searchParams.append("user-id", u));

    url.searchParams.set("tl", `${trailLenghtHours}`);
    const response = await fetch(url);
    return await response.json() as Trails;
  } catch (e) {
    return {};
  }
}

async function fetchMapPositions(
  apiUrl: string,
  bounds: MapBounds,
): Promise<LocationResponse> {
  try {
    const url = new URL("/api/positions_bounded", apiUrl);
    url.searchParams.append("north", `${bounds.north}`);
    url.searchParams.append("east", `${bounds.east}`);
    url.searchParams.append("west", `${bounds.west}`);
    url.searchParams.append("south", `${bounds.south}`);

    const response = await fetch(url);
    const result = await response.json() as LocationResponse;
    return result;
  } catch (e) {
    return { positions: [] };
  }
}
