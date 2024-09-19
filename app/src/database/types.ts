import {Prisma} from "@prisma/client";

export type OfferRequirementsWithLocation = Prisma.OfferRequirementsGetPayload<{ include: { location: true } }>