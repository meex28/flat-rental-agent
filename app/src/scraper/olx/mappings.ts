import {OwnershipType, PropertyType} from "@prisma/client";

export const ownershipTypeUrlMappings: Record<OwnershipType, string> = {
  RENT: "wynajem",
  SALE: "sprzedaz"
}

export const propertyTypeUrlMappings: Record<PropertyType, string> = {
  FLAT: "mieszkania",
  HOUSE: "domy",
  LAND: "dzialki"
}