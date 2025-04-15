import { useEffect, useRef } from "preact/hooks";
import maplibregl from "maplibre-gl";

import mapStyles from "./barents.json" with { type: "json" };
import { NONE } from "$fresh/runtime.ts";

export default function BoatMap() {
 
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
  
    useEffect(() => {
      if (map.current) return; // initialize map only once
      if (!mapContainer.current) return;
  
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyles,
        center: [5.5, 62.5],
        zoom: 8,
      });
  
      // Add navigation control
      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
  
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
            overflow:NONE,
          }}
      />
    );
    
    
}
