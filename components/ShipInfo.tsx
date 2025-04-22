import { ShipPosition } from "../types/api.ts";

export default function ShipInfo({selectedInfo}:{selectedInfo:ShipPosition}){
    return (<div>shinpoin {selectedInfo.static.info?.name}</div>)
}