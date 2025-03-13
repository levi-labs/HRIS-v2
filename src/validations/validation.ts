import { ZodType } from "zod";


export class Validation {
    static validate<T>(schema:ZodType<T>,data:any):T{
        return schema.parse(data);
    }
}