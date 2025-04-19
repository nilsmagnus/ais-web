import { useEffect, useRef } from "preact/hooks";
import maplibregl, { StyleSpecification } from "maplibre-gl";

import mapStyles from "./barents.json" with { type: "json" };
import { NONE } from "$fresh/runtime.ts";
import { FeatureCollection } from "@t/geojson";
import { MapBounds, ShipPosition } from "../types/api.ts";
import { effect, Signal } from "@preact/signals";
import { shipColor, shiptypes } from "../types/shipconstants.ts";
import {
  createShipMarker,
  createStillShipMarker,
} from "../components/ShipMarker.tsx";

interface BoapMapProps {
  shipLocations: Signal<ShipPosition[]>;
  boundsUpdated: (bounds: MapBounds) => void;
}

export default function BoatMap(
  { shipLocations, boundsUpdated }: BoapMapProps,
) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const hoverPopup = useRef<maplibregl.Popup | null>(null);
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

      shiptypes.map((shipType) => {
        const img = new Image();
        img.onload = () => {
          map.current!.addImage(`${shipType.typeId}`, img);
        };
        img.src = createShipMarker(`${shipType.typeId}`);
        const stillImg = new Image();
        stillImg.onload = () => {
          map.current!.addImage(`still-${shipType.typeId}`, stillImg);
        };
        stillImg.src = createStillShipMarker(`${shipType.typeId}`);
      });

      map.current!.addLayer({
        id: "boat-icon-layer",
        type: "symbol",
        source: "boat-source",
        layout: {
          "text-anchor": "center",
          "text-offset": [0, -0.6],
          "text-field": ["get", "shipName"],
          "text-allow-overlap": true,
          "icon-image": [
            "case",
            ["has", "heading"], // If heading equals 511
            ["get", "shipType"],
            ["concat", "still-", ["get", "shipType"]],
          ],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "icon-rotate": ["get", "heading"],
        },
        paint: {
          "text-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13,
            0,
            14,
            1,
            20,
            1,
          ],
        },
      });

      hoverPopup.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15,
        className: "boat-icon-layer", // For custom styling
      });

      map.current!.on("mouseenter", "boat-icon-layer", (e) => {
        // Change cursor style
        map.current!.getCanvas().style.cursor = "pointer";

        // Get the feature data
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties;

        // Create popup content
        const popupContent = `
          <div class="ship-info-box">
            <h4>${props.shipName}</h4>
            <h4>${props.userId}</h4>
            <div>Type: ${props.category}</div>
            <div>Fart: ${props.sog ?? "-"} knots</div>
            <div>Retning: ${
          props.heading === "511" || props.heading === undefined
            ? "N/A"
            : props.heading + "°"
        }</div>
          </div>
        `;

        // Set popup position and content
        if (feature.geometry.type === "Point") {
          hoverPopup.current!
            .setLngLat([
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1],
            ])
            .setHTML(popupContent)
            .addTo(map.current!);
        } else {
          console.log("feature geometry type is ", feature.geometry.type);
        }
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
        heading: s.trueHeading == 511 ? undefined : s.trueHeading,
        shipName: atob(s.static.info?.name ?? "QklPIE5BVklHQVRPUg=="),
        category: categorise(s),
        sog: s.sog ?? "-",
        userId: s.userId,
        shipType: s.static.info?.ship_type ?? "0",
        color: shipColor(s.static.info?.ship_type ?? "0"),
      },
      geometry: {
        type: "Point",
        coordinates: [s.lon, s.lat],
      },
    })),
  };
}

function categorise(s: ShipPosition): string {
  if (s.static.info?.ship_type) {
    const t = +s.static.info.ship_type;
    const shipType = shiptypes.find((st) => st.typeId == t);
    if (shipType !== undefined) {
      return shipType.typeName;
    }
  }
  if (`${s.userId}`.startsWith("109")) {
    return "Bøye";
  }
  return s.static.info?.ship_type ?? "u";
}
