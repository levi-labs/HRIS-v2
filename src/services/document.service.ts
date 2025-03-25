import prisma from "../config/prisma.js";
import { ResponseError } from "../error/response.errors.js";
import { DocumentRequest } from "../types/document.type.js";
import { documentSchema } from "../validations/document.validation.js";
import { Validation } from "../validations/validation.js";
import fs from "fs";

export class DocumentService{
    static async getAll():Promise<DocumentRequest[]> {
        const result = await prisma.document.findMany();
        return result;
    }
    static async getById(id:number):Promise<DocumentRequest> {
        const result = await prisma.document.findUnique({
            where: {
                id
            }
        });
        if(!result){
            throw new ResponseError(404,"Document not found");
        }
        return result;
    }
    static async create(data:DocumentRequest):Promise<DocumentRequest>{
       const validate = Validation.validate<DocumentRequest>(documentSchema,data);
       const result = await prisma.document.create({
           data: {
               employeeId: validate.employeeId,
               title: validate.title,
               filePath: validate.filePath
           }
       });
       return result;
    }

    static async update (id:number,data:DocumentRequest):Promise<DocumentRequest> {
        const checkExistDocument = await prisma.document.findFirst({
            where: {
                id
            }
        });

        if (!checkExistDocument) {
            throw new ResponseError(404,"Data for document not found");
        }


        const validate = Validation.validate<DocumentRequest>(documentSchema,data);

        if(fs.existsSync(checkExistDocument.filePath)){
            fs.unlinkSync(checkExistDocument.filePath);
        }

      
       return await prisma.document.update({
            where: {
                id
            },
            data: {
                title: validate.title,
                filePath: validate.filePath
            }
        });

    }

    static async delete(id:number):Promise<DocumentRequest> {
        const checkExistDocument = await prisma.document.findFirst({
            where: {
                id
            }
        });

        if (!checkExistDocument) {
            throw new ResponseError(404,"Data for document not found");
        }
        
        if (fs.existsSync(checkExistDocument.filePath)) {
            fs.unlinkSync(checkExistDocument.filePath);
        }
        return await prisma.document.delete({
            where: {
                id
            }
        });
    }

}