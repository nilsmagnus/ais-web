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

  const [shipLocations, setShipLocations] = useState<ShipPosition[]>([]);

  const [selectedUserIds, setSelectedUserids] = useState<string[]>([]);

  const [trails, setTrails] = useState<Trails>({});

  useEffect(() => {
    console.log("init userids");
    const url = new URL(globalThis.window.location.href);
    setSelectedUserids(url.searchParams.getAll("u"));
  }, []);

  useEffect(() => {
    console.log("fetch trails");
    fetchTrails(apiUrl, selectedUserIds).then((t) => setTrails(t));
  }, [selectedUserIds]);

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
  const boundsUpdated = (bounds: MapBounds)=>{
    mapBounds.current = bounds;
    fetchMapPositions(apiUrl, bounds)
      .then((v) => {
          setShipLocations(v.positions);
      });
  };

  const toggleUserIdSelect=(userId: string)=> {
    if (selectedUserIds.includes(userId)) {
      return;
    }
    setSelectedUserids([...selectedUserIds, userId]);

    // const url = new URL(globalThis.location.href);
    // url.searchParams.append("u", userId);
    // globalThis.history.pushState({}, "", url);
  }

  function clearSelection() {
    console.log("clear selection");
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("u");
    globalThis.history.pushState({}, "", url);

    setSelectedUserids([]);
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
      <div className="absolute bottom-1 left-1 bg-slate-200 rounded-md p-2 flex">
        <div>
          {selectedUserIds.map((u) => {
            return <div key={u}>{u}</div>;
          })}
        </div>
        <div className="cursor-pointer" onClick={clearSelection}>
          {selectedUserIds.length}❌
        </div>
      </div>
    </div>
  );
}

async function fetchTrails(apiUrl: string, userIds: string[]): Promise<Trails> {
  if (userIds.length === 0) {
    return {};
  }
  try {
    const url = new URL("/api/trails", apiUrl);
    userIds.forEach((u) => url.searchParams.append("user-id", u));

    const response = await fetch(url);
    return await response.json() as Trails;
  } catch (e) {
    console.log("trails failed to fetch");
    console.log(e);
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
    console.log("something bad happened!");
    console.log(e);
    return { positions: [] };
  }
}
