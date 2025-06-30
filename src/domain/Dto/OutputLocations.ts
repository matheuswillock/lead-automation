import { Output } from "@/domain/Output";

export class OutputLocations {
  locations: LocationData[];

  constructor(locations: LocationData[] = []) {
    this.locations = locations;
  }

  static CreateOutput(locations: LocationData[]): Output {
    const result = new OutputLocations(locations);

    if (!result.locations || result.locations.length === 0) {
      return new Output(false, [], ["No locations found"], null);
    }

    return new Output(true, ["Locations retrieved successfully"], [], result);
  }
}

export class LocationData {
  name: string | undefined;
  canonicalName: string | undefined;
  googleId: string | undefined;
  countryCode: string | undefined;
  targetType: string | undefined;

  constructor(
    name?: string,
    canonicalName?: string,
    googleId?: string,
    countryCode?: string,
    targetType?: string
  ) {
    this.name = name;
    this.canonicalName = canonicalName;
    this.googleId = googleId;
    this.countryCode = countryCode;
    this.targetType = targetType;
  }
}