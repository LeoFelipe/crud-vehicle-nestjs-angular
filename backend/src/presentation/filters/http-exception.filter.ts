import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    let errors: string[] = [];
    let success = false;

    // Validação de DTO
    if (exception instanceof BadRequestException && exception.getResponse) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res['message']) {
        errors = Array.isArray(res['message']) ? res['message'] : [res['message']];
      } else {
        errors = [res as string];
      }
    }
    // BusinessException customizada
    else if (exception.name === 'BusinessException') {
      errors = Array.isArray(exception.message) ? exception.message : [exception.message];
    }
    // Outros erros
    else if (exception instanceof HttpException) {
      errors = [exception.message];
    } else {
      errors = ['Erro interno do servidor'];
    }

    response.status(status).json({
      success,
      statusCode: status,
      response: errors,
    });
  }
} 