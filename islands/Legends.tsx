import { useSignal } from "@preact/signals";

import { shiptypesForLegends } from "../types/shipconstants.ts";
import ShipMarker from "../components/ShipMarker.tsx";

export default function Legends() {
  const expanded = useSignal(false);
  function toggle(e: MouseEvent) {
    expanded.value = !expanded.value;
  }
  return (
    <div className="absolute z-10 top-1 left-1 bg-slate-200 rounded-md p-2">
      <div className="mr-4 ">
        <button type="button" onClick={toggle}>
          <span className="mr-2">Symbolforklaring</span>
          {!expanded.value && <span>◀︎</span>}
          {expanded.value && <span>▼</span>}
        </button>
      </div>

      {expanded.value &&
        (
          <div>
            <ul>
              {shiptypesForLegends.map((shipType) => (
                <li className="flex">
                  <ShipMarker shipType={`${shipType.typeId}`}></ShipMarker>
                  <div>
                    {shipType.typeName}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
