import { OfficeScheduleDays } from "@prisma/client";

export const getDayName = (date: Date,locale:string ="id-ID") => {
   const today = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date).toUpperCase();
   return OfficeScheduleDays[today as keyof typeof OfficeScheduleDays];
}
export const getTimeNow = (timeWork:any,timeTolerance:any) => {
   const currentTimeUTC = new Date();
   const timeStampNow = currentTimeUTC.getTime();
   const nowWIB = new Date(timeStampNow + 7 * 60 * 60 * 1000); //konversi UTC ke WIB

   const workStartInUTC = new Date(timeWork);
   const workStartInWIB =workStartInUTC.getTime(); 

   const workInWIB = new Date(workStartInWIB + 7 * 60 * 60 * 1000);

   const workStartWithTolerance = new Date(workStartInWIB + 7 * 60 * 60 * 1000 + timeTolerance * 60000);
   return {
      status:timeStampNow > workStartWithTolerance.getTime(),
      nowWIB
   };

}