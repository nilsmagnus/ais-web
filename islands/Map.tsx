import { useEffect, useRef } from "preact/hooks";
import maplibregl, { StyleSpecification } from "maplibre-gl";

import mapStyles from "./barents.json" with { type: "json" };
import { NONE } from "$fresh/runtime.ts";
import { FeatureCollection } from "@t/geojson";
import { MapBounds, ShipPosition } from "../types/api.ts";
import { effect, Signal } from "@preact/signals";
import { shiptypes } from "../types/shipconstants.ts";

interface BoapMapProps {
  shipLocations: Signal<ShipPosition[]>;
  boundsUpdated: (bounds: MapBounds) => void;
}

export default function BoatMap(
  { shipLocations, boundsUpdated }: BoapMapProps,
) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // update map when shiplocations change
  effect(() => {
    shipLocations.value; // do not remove reference
    if (!map.current) {
      return;
    }

    (map.current!.getSource("boat-source") as maplibregl.GeoJSONSource)
      ?.setData(boatSourceData(shipLocations.value));
  });

  useEffect(function initializeMap() {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles as StyleSpecification,
      center: [5.5, 62.5],
      zoom: 8,
    });

    const updateBounds = () => {
      const bounds = map.current?.getBounds();
      if (bounds) {
        boundsUpdated({
          north: bounds.getNorth(),
          east: bounds.getEast(),
          south: bounds.getSouth(),
          west: bounds.getWest(),
        });
      }
    };

    map.current.on("moveend", updateBounds);
    map.current.on("zoomend", updateBounds);

    // Add navigation control
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // add layers
    function addLayers() {
      map.current!.addSource("boat-source", boatSource(shipLocations.value));

      map.current!.addLayer({
        id: "boat-layer",
        type: "circle",
        source: "boat-source",
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": 5,
        },
      });

      map.current!.addLayer({
        id: "boat-category",
        type: "symbol",
        source: "boat-source",
        minzoom: 9,
        maxzoom: 20,
        layout: {
          "text-field": ["get", "shipName"],
          "text-anchor": "center",
          "text-offset": [0, -0.6],
          "text-rotate" :["get", "heading"]

        },

        paint: {
          "text-color": "black",
        },
      });

    }

    if (map.current.loaded()) {
      addLayers();
    } else {
      map.current.on("load", addLayers);
    }

    // Cleanup on unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      // style={{ width: "100%", height: "600px" }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100vh",
        overflow: NONE,
      }}
    />
  );
}

function boatSource(
  shipLocations: ShipPosition[],
): maplibregl.SourceSpecification | maplibregl.CanvasSourceSpecification {
  return {
    type: "geojson",
    data: boatSourceData(shipLocations),
  };
}

function boatSourceData(shipLocations: ShipPosition[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: shipLocations.map((s: ShipPosition) => ({
      type: "Feature",
      properties: {
        heading: s.trueHeading == 511? undefined: s.trueHeading,
        shipName: atob(s.static.info?.name ?? "QklPIE5BVklHQVRPUg=="),
        category: categorise(s),
        color: shipColor(s.static.info?.ship_type ?? "0"),
      },
      geometry: {
        type: "Point",
        coordinates: [s.lon, s.lat],
      },
    })),
  };
}

function shipColor(ship_type: string): string {
  const s = +ship_type;
  switch (true) {
    case (s == 10):
      return "lightblue";
    case (s >=90):
      return "brown";
    case (s == 36):
      return "lightgreen";
    case (s == 37):
      return "pink";
    case (s == 55):
      return "darkblue";
    case (s == 30):
      return "orange";
    case (s == 35):
      return "darkgreen";
    case (s >= 50 && s < 60):
      return "purple";
    case (s >= 40 && s < 50):
      return "yellow";
    case (s >= 60 && s < 70):
      return "green";
    case (s >= 70 && s < 80):
      return "red";
    case (s >= 80 && s < 90):
      return "black";
    default:
      return "cyan";
  }
}

function categorise(s: ShipPosition): string {
  if(s.static.info?.ship_type){
    const t = +s.static.info.ship_type;
    const shipType = shiptypes.find((st)=>st.typeId == t);
    if(shipType !== undefined){
      return shipType.typeName;
    }
  }
  if(`${s.userId}`.startsWith("109")){
    return "Bøye";
  }
  return s.static.info?.ship_type ??"u";
}
