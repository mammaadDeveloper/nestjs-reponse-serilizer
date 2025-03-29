import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataSerializerInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: Type<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response || !response.data) return response;

        const data = Array.isArray(response.data)
          ? response.data.map((item) => plainToInstance(this.dto, item, { excludeExtraneousValues: true }))
          : plainToInstance(this.dto, response.data, { excludeExtraneousValues: true });

        return {
          ...response,
          data,
        };
      }),
    );
  }
}
