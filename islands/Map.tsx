import { useEffect, useRef } from "preact/hooks";
import maplibregl, { StyleSpecification } from "maplibre-gl";

import mapStyles from "./barents.json" with { type: "json" };
import { NONE } from "$fresh/runtime.ts";
import { FeatureCollection } from "@t/geojson";
import { MapBounds, ShipPosition } from "../types/api.ts";
import { effect, Signal } from "@preact/signals";

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
        id: "boat-names",
        type: "symbol",
        source: "boat-source",
        minzoom: 9,
        maxzoom:20,
        layout: {
          "text-field": ["get", "shipName"],
          "text-anchor":"center",
          "text-offset":[0,0.6]
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
        shipName: atob(s.static.info?.name ?? "QklPIE5BVklHQVRPUg=="),
        type: s.static.info?.ship_type ?? `${s.userId}`,
        color: shipColor(s.static.info?.ship_type ?? "#0f0f0f"),
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
    case (s == 36):
      return "lightgreen";
    case (s == 37):
      return "darkgreen";
    case (s == 55):
      return "darkblue";
    case (s == 30):
      return "orange";
    case (s == 50):
      return "yellow";
    case (s >= 60 && s < 70):
      return "green";
    case (s >= 70 && s < 80):
      return "red";
    case (s >= 80 && s < 90):
      return "black";
  }

  return "cyan";
}


const shiptypes = {
  0: "Ukjent",
  20: "Wing in ground (WIG)",
  21: "Wing in ground (WIG), Hazardous category A",
  22: "Wing in ground (WIG), Hazardous category B",
  23: "Wing in ground (WIG), Hazardous category C",
  24: "Wing in ground (WIG), Hazardous category D",
  25: "Wing in ground (WIG)",
  26: "Wing in ground (WIG)",
  27: "Wing in ground (WIG)",
  28: "Wing in ground (WIG)",
  29: "Wing in ground (WIG)",
  30: "Fishing",
  31: "Towing",
  32: "Towing: length exceeds 200m or breadth exceeds 25m",
  33: "Dredging or underwater ops",
  34: "Diving ops",
  35: "Military ops",
  36: "Sailing",
  37: "Pleasure Craft",
  38: "Reserved",
  39: "Reserved",
  40: "High speed craft (HSC)",
  41: "High speed craft (HSC), Hazardous category A",
  42: "High speed craft (HSC), Hazardous category B",
  43: "High speed craft (HSC), Hazardous category C",
  44: "High speed craft (HSC), Hazardous category D",
  45: "High speed craft (HSC)",
  46: "High speed craft (HSC)",
  47: "High speed craft (HSC)",
  48: "High speed craft (HSC)",
  49: "High speed craft (HSC), No additional information",
  50: "Pilot Vessel",
  51: "Search and Rescue vessel",
  52: "Tug",
  53: "Port Tender",
  54: "Anti-pollution equipment",
  55: "Law Enforcement",
  56: "Spare - Local Vessel",
  57: "Spare - Local Vessel",
  58: "Medical Transport",
  59: "Noncombatant ship according to RR Resolution No. 18",
  60: "Passenger",
  61: "Passenger, Hazardous category A",
  62: "Passenger, Hazardous category B",
  63: "Passenger, Hazardous category C",
  64: "Passenger, Hazardous category D",
  65: "Passenger",
  66: "Passenger",
  67: "Passenger",
  68: "Passenger",
  69: "Passenger, No additional information",
  70: "Cargo",
  71: "Cargo, Hazardous category A",
  72: "Cargo, Hazardous category B",
  73: "Cargo, Hazardous category C",
  74: "Cargo, Hazardous category D",
  75: "Cargo",
  76: "Cargo",
  77: "Cargo",
  78: "Cargo",
  79: "Cargo, No additional information",
  80: "Tanker",
  81: "Tanker, Hazardous category A",
  82: "Tanker, Hazardous category B",
  83: "Tanker, Hazardous category C",
  84: "Tanker, Hazardous category D",
  85: "Tanker",
  86: "Tanker",
  87: "Tanker",
  88: "Tanker",
  89: "Tanker, No additional information",
  90: "Other Type",
  91: "Other Type, Hazardous category A",
  92: "Other Type, Hazardous category B",
  93: "Other Type, Hazardous category C",
  94: "Other Type, Hazardous category D",
  95: "Other Type",
  96: "Other Type",
  97: "Other Type",
  98: "Other Type",
  99: "Other Type, no additional information",
};

const navigationStatus = {
  0: "Under way using engine",
  1: "At anchor",
  2: "Not under command",
  3: "Restricted manoeuverability",
  4: "Constrained by her draught",
  5: "Moored",
  6: "Aground",
  7: "Engaged in Fishing",
  8: "Under way sailing",
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: "AIS-SART is active",
  15: "Not known"
};
