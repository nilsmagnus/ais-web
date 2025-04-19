export interface ShipType {
  typeId: number;
  typeName: string;
}

export const shiptypes: ShipType[] = [
  { typeId: 0, typeName: "Ukjent" },
  { typeId: 1, typeName: "Ukjent" },
  { typeId: 2, typeName: "Ukjent" },
  { typeId: 3, typeName: "Ukjent" },
  { typeId: 4, typeName: "Ukjent" },
  { typeId: 5, typeName: "Ukjent" },
  { typeId: 6, typeName: "Ukjent" },
  { typeId: 7, typeName: "Ukjent" },
  { typeId: 8, typeName: "Ukjent" },
  { typeId: 9, typeName: "Ukjent" },
  { typeId: 10, typeName: "Ukjent" },
  { typeId: 12, typeName: "Ukjent" },
  { typeId: 20, typeName: "Wing in ground (WIG)" },
  { typeId: 21, typeName: "Wing in ground (WIG), Hazardous category A" },
  { typeId: 22, typeName: "Wing in ground (WIG), Hazardous category B" },
  { typeId: 23, typeName: "Wing in ground (WIG), Hazardous category C" },
  { typeId: 24, typeName: "Wing in ground (WIG), Hazardous category D" },
  { typeId: 25, typeName: "Wing in ground (WIG)" },
  { typeId: 26, typeName: "Wing in ground (WIG)" },
  { typeId: 27, typeName: "Wing in ground (WIG)" },
  { typeId: 28, typeName: "Wing in ground (WIG)" },
  { typeId: 29, typeName: "Wing in ground (WIG)" },
  { typeId: 30, typeName: "Fiskebåt" },
  { typeId: 31, typeName: "Tauebåt" },
  { typeId: 32, typeName: "Stor tauebåt" },
  { typeId: 33, typeName: "Dredging or underwater ops" },
  { typeId: 34, typeName: "Dykkerbåt" },
  { typeId: 35, typeName: "Marinen" },
  { typeId: 36, typeName: "Seilbåt" },
  { typeId: 37, typeName: "Fritidsbåt" },
  { typeId: 38, typeName: "Reserved" },
  { typeId: 39, typeName: "Reserved" },
  { typeId: 40, typeName: "High speed craft (HSC)" },
  { typeId: 41, typeName: "High speed craft (HSC), Hazardous category A" },
  { typeId: 42, typeName: "High speed craft (HSC), Hazardous category B" },
  { typeId: 43, typeName: "High speed craft (HSC), Hazardous category C" },
  { typeId: 44, typeName: "High speed craft (HSC), Hazardous category D" },
  { typeId: 45, typeName: "High speed craft (HSC)" },
  { typeId: 46, typeName: "High speed craft (HSC)" },
  { typeId: 47, typeName: "High speed craft (HSC)" },
  { typeId: 48, typeName: "High speed craft (HSC)" },
  { typeId: 49, typeName: "High speed craft (HSC), No additional information" },
  { typeId: 50, typeName: "Los" },
  { typeId: 51, typeName: "Søk og redning" },
  { typeId: 52, typeName: "Tug" },
  { typeId: 53, typeName: "Port Tender" },
  { typeId: 54, typeName: "Anti-pollution equipment" },
  { typeId: 55, typeName: "Kystvakt/politi" },
  { typeId: 56, typeName: "Spare - Local Vessel" },
  { typeId: 57, typeName: "Spare - Local Vessel" },
  { typeId: 58, typeName: "Medisinsk transport" },
  {
    typeId: 59,
    typeName: "Noncombatant ship according to RR Resolution No. 18",
  },
  { typeId: 60, typeName: "Passasjerbåt" },
  { typeId: 61, typeName: "Passasjerbåt, Hazardous category A" },
  { typeId: 62, typeName: "Passasjerbåt, Hazardous category B" },
  { typeId: 63, typeName: "Passasjerbåt, Hazardous category C" },
  { typeId: 64, typeName: "Passasjerbåt, Hazardous category D" },
  { typeId: 65, typeName: "Passasjerbåt" },
  { typeId: 66, typeName: "Passasjerbåt" },
  { typeId: 67, typeName: "Passasjerbåt" },
  { typeId: 68, typeName: "Passasjerbåt" },
  { typeId: 69, typeName: "Passasjerbåt, No additional information" },
  { typeId: 70, typeName: "Cargo" },
  { typeId: 71, typeName: "Cargo, Hazardous category A" },
  { typeId: 72, typeName: "Cargo, Hazardous category B" },
  { typeId: 73, typeName: "Cargo, Hazardous category C" },
  { typeId: 74, typeName: "Cargo, Hazardous category D" },
  { typeId: 75, typeName: "Cargo" },
  { typeId: 76, typeName: "Cargo" },
  { typeId: 77, typeName: "Cargo" },
  { typeId: 78, typeName: "Cargo" },
  { typeId: 79, typeName: "Cargo, No additional information" },
  { typeId: 80, typeName: "Tanker" },
  { typeId: 81, typeName: "Tanker, Hazardous category A" },
  { typeId: 82, typeName: "Tanker, Hazardous category B" },
  { typeId: 83, typeName: "Tanker, Hazardous category C" },
  { typeId: 84, typeName: "Tanker, Hazardous category D" },
  { typeId: 85, typeName: "Tanker" },
  { typeId: 86, typeName: "Tanker" },
  { typeId: 87, typeName: "Tanker" },
  { typeId: 88, typeName: "Tanker" },
  { typeId: 89, typeName: "Tanker, No additional information" },
  { typeId: 90, typeName: "Other Type" },
  { typeId: 91, typeName: "Other Type, Hazardous category A" },
  { typeId: 92, typeName: "Other Type, Hazardous category B" },
  { typeId: 93, typeName: "Other Type, Hazardous category C" },
  { typeId: 94, typeName: "Other Type, Hazardous category D" },
  { typeId: 95, typeName: "Other Type" },
  { typeId: 96, typeName: "Other Type" },
  { typeId: 97, typeName: "Other Type" },
  { typeId: 98, typeName: "Other Type" },
  { typeId: 99, typeName: "Other Type, no additional information" },
];

export function shipColor(ship_type: string): string {
  const s = +ship_type;
  switch (true) {
    case (s == 10):
      return "red";
    case (s >= 90):
      return "brown";
    case (s == 36):
      return "lightgreen";
    case (s == 37):
      return "pink";
    case (s == 55):
      return "darkblue";
    case (s == 30):
      return "orange";
    case (s == 34):
      return "#f8d210";
    case (s == 35):
      return "darkgreen";
    case (s == 50):
      return "brown";
    case (s == 51):
      return "grey";
    case (s == 58):
      return "#fa26a0";
    case (s >= 50 && s < 60):
      return "purple";
    case (s >= 20 && s < 30):
      return "blue";
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

export const shiptypesForLegends: ShipType[] = [
  { typeId: 0, typeName: "Ukjent" },
  { typeId: 20, typeName: "Wing in ground (WIG)" },
  { typeId: 30, typeName: "Fiskebåt" },
  { typeId: 31, typeName: "Tauebåt" },
  { typeId: 32, typeName: "Stor tauebåt" },
  { typeId: 33, typeName: "Dredging or underwater ops" },
  { typeId: 34, typeName: "Dykkerbåt" },
  { typeId: 35, typeName: "Marinen" },
  { typeId: 36, typeName: "Seilbåt" },
  { typeId: 37, typeName: "Fritidsbåt" },
  { typeId: 38, typeName: "Reserved" },
  { typeId: 40, typeName: "High speed craft (HSC)" },
  { typeId: 50, typeName: "Los" },
  { typeId: 51, typeName: "Søk og redning" },
  { typeId: 52, typeName: "Tug" },
  { typeId: 53, typeName: "Port Tender" },
  { typeId: 54, typeName: "Anti-pollution equipment" },
  { typeId: 55, typeName: "Kystvakt/politi" },
  { typeId: 56, typeName: "Spare - Local Vessel" },
  { typeId: 58, typeName: "Medisinsk transport" },
  { typeId: 59, typeName: "Noncombatant Res No. 18" },
  { typeId: 60, typeName: "Passasjerbåt" },
  { typeId: 70, typeName: "Cargo" },
  { typeId: 80, typeName: "Tanker" },
  { typeId: 90, typeName: "Other Type" },
];
