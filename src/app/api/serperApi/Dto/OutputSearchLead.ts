import { Output } from "@/domain/Output";

export default class OutputSearchLead {
  searchParameters?: SearchParameters;
  places?: Place[];
  credits?: number;

  constructor(
    searchParameters?: SearchParameters,
    places?: Place[],
    credits?: number
  ) {
    this.searchParameters = searchParameters;
    this.places = places;
    this.credits = credits;
  }

  static ToValidOutput(
    searchParameters: SearchParameters,
    places: Place[],
    credits: number
  ): Output {
    const result = new OutputSearchLead(
      searchParameters,
      places,
      credits
    );

    return new Output(
      true,
      ["Search completed successfully"],
      [],
      result
    );
  }
}

export class SearchParameters {
  q: string;
  gl: string;
  hl: string;
  uule: string;
  type: string;
  num: number;
  page: number;
  location: string;
  disableBackup: boolean;
  engine: string;

  constructor(
    q: string,
    gl: string,
    hl: string,
    uule: string,
    type: string,
    num: number,
    page: number,
    location: string,
    disableBackup: boolean,
    engine: string
  ) {
    this.q = q;
    this.gl = gl;
    this.hl = hl;
    this.uule = uule;
    this.type = type;
    this.num = num;
    this.page = page;
    this.location = location;
    this.disableBackup = disableBackup;
    this.engine = engine;
  }
}

export class Place {
  position: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  priceLevel: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  cid: string;

  constructor(
    position: number,
    title: string,
    address: string,
    latitude: number,
    longitude: number,
    rating: number,
    ratingCount: number,
    priceLevel: string,
    category: string,
    cid: string,
    phoneNumber?: string,
    website?: string
  ) {
    this.position = position;
    this.title = title;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rating = rating;
    this.ratingCount = ratingCount;
    this.priceLevel = priceLevel;
    this.category = category;
    this.cid = cid;
    this.phoneNumber = phoneNumber;
    this.website = website;
  }
}