import {tap} from 'rxjs/operators';
import {MonoTypeOperatorFunction, pipe} from 'rxjs';

export function tapOnce<T>(fn: Function): MonoTypeOperatorFunction<T> {
    let isFirst = true;

    return pipe(
        tap(actions => {
            if (!isFirst) {
                return;
            }

            fn(actions);
            isFirst = false;
        })
    )
}
