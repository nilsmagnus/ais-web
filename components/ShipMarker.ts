import { shipColor } from "../types/shipconstants.ts";

export function createShipMarker(shipType: string): string {
  const color = shipColor(shipType);

  const svg = `
      <svg width="20" height="20" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
        <polygon points="7,0 0,20 14,20" fill="${color}" />
      </svg>
    `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
