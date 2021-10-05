import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { recursivelyStripNullValues } from './recursively-strip-null-values';

export class ExcludeNullInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(map((value) => recursivelyStripNullValues(value)));
	}
}
