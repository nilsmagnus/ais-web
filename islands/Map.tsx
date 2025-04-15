import { useEffect, useRef, useState } from "preact/hooks";
import maplibregl, { StyleSpecification } from "maplibre-gl";

import mapStyles from "./barents.json" with { type: "json" };
import { NONE } from "$fresh/runtime.ts";
import { LocationResponse, MapBounds, ShipPosition } from "../types/api.ts";
import { FeatureCollection } from "@t/geojson";
import { computed, effect, untracked, useSignal } from "@preact/signals";

interface BoapMapProps {
  refreshData: (bounds: MapBounds) => Promise<LocationResponse>;
}

export default function BoatMap({ refreshData }: BoapMapProps) {
  const shipLocations = useSignal<ShipPosition[]>([]);
  const mapBounds = useRef({
    west: 5.2,
    south: 62.0,
    east: 5.8,
    north: 62.5,
  });
  const mapBoundsS = useSignal(mapBounds.current);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // refresh data continuously
  useEffect(() => {
    function refresh() {
      refreshData(mapBounds.current)
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
    mapBoundsS.value; // do not remove reference for effect
    if (!map.current) return;
    refreshData(mapBounds.current)
      .then((v) => {
        untracked(() => {
          shipLocations.value = v.positions;
        });
      });
  });

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
      if (!map.current) return;
      const bounds = map.current.getBounds();
      mapBounds.current = ( {
        north: bounds.getNorth(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
      });
      mapBoundsS.value = mapBounds.current;
    };

    map.current.on("moveend", updateBounds);
    map.current.on("zoomend", updateBounds);
    map.current.on("rotateend", updateBounds);
    map.current.on("pitchend", updateBounds);
    map.current.on("resize", updateBounds);

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
          "circle-color": "#ff0000",
          "circle-radius": 5,
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
        name: "dingdong",
      },
      geometry: {
        type: "Point",
        coordinates: [s.lon, s.lat],
      },
    })),
  };
}
