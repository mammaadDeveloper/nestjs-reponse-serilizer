import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface MetaData {
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

interface ResponseFormat<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  meta?: MetaData;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();
        const statusCode = httpResponse.statusCode;

        const defaultMessage = 'DEFAUL_MESSAGE';
        const { meta, message, ...data } = response || {};

        const finalMessage = message || defaultMessage;

        return {
          success: true,
          status: statusCode,
          message: finalMessage,
          data: data ?? null,
          meta: meta ?? undefined,
        };
      }),
    );
  }
}
