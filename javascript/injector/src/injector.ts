import 'reflect-metadata';
import { Type } from './utils';

export const Injector = new class {
    resolve<T>(target: Type<any>): T {
        let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        console.warn(tokens, target);
        let injections = tokens.map((token: any) => Injector.resolve<any>(token));

        return new target(...injections);
    }
}