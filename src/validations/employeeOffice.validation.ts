import {z} from "zod";
const today = new Date();
today.setHours(0, 0, 0, 0);

export const employeeOfficeSchema = z.object({
    employeeId: z.number(),
    officeId: z.number(),
    startDate: z.date().refine((date) => {
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        return inputDate >= today;
      }, {
        message: "startDate tidak boleh di masa lalu",
      }),
    endDate:z.date().nullable().optional()
}).refine((data) => {
    if (data.endDate) {
      return data.startDate < data.endDate;
    }
    return true;
  }, {
    message: "startDate harus lebih kecil dari endDate",
    path: ["startDate"],
});