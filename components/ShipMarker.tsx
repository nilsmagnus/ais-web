import { shipColor } from "../types/shipconstants.ts";

export default function ShipMarker({shipType}:{shipType: string}) {
  const color = shipColor(shipType);

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="7,0 0,20 14,20" fill={color} />
    </svg>
  );
}

export function createShipMarker(shipType: string): string {
  const color = shipColor(shipType);

  const svg = `
        <svg width="20" height="20" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
          <polygon points="7,0 0,20 14,20" fill="${color}" stroke="black" stroke-width="1" />
        </svg>
      `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createStillShipMarker(shipType: string): string {
  const color = shipColor(shipType);

  const svg = `
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>
      `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
