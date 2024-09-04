import {DateTime} from "luxon";

export function getCurrentTimeInPoland(): Date {
  const currentTimeInWarsaw = DateTime.now().setZone('Europe/Warsaw');
  return currentTimeInWarsaw.toJSDate();
}
