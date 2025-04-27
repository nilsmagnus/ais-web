import { ShipPosition } from "../types/api.ts";

export default function ShipInfo({ ships }: { ships: ShipPosition[] }) {
  function heading(trueHeading: number): string {
    if (trueHeading == 511) {
      return "n/a";
    } else return `${trueHeading}°N`;
  }

  return (
    <table>
      <tbody>
        {ships.map((s) => (
          <tr>
            <td>
              {atob(s.static.info?.name ?? "")}
            </td>
            <td className="pl-5">{s.sog} knop</td>
            <td className="pl-5">{heading(s.trueHeading)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
