import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { ApiResponse } from "./shared/interfaces";

interface CustomResponse {
    message?: string;
    error?: string;
}

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx  = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const myResponseObj: ApiResponse<any> = {
            statusCode: 500,
            message: 'Internal Server Error',
            error: 'Internal Server Error'
        }

        if (exception instanceof HttpException) {
            const responseObject = exception.getResponse() as CustomResponse;
            if (responseObject?.message) myResponseObj.message = responseObject.message;
            if (responseObject?.error) {
                myResponseObj.error = responseObject.error;
            } else delete myResponseObj.error;
            myResponseObj.statusCode = exception.getStatus();
        } else if (exception instanceof Error) {
            myResponseObj.message = exception.message
        }
        
        response
            .status(myResponseObj.statusCode)
            .json(myResponseObj)

        super.catch(exception, host)
    }
}