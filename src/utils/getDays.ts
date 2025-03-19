import { OfficeScheduleDays } from "@prisma/client";

export const getDayName = (date: Date,locale:string ="id-ID") => {
   const today = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toUpperCase();
   return OfficeScheduleDays[today as keyof typeof OfficeScheduleDays];
}