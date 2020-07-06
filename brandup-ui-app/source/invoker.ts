import { Middleware, InvokeContext } from "./middleware";
import { Utility } from "brandup-ui";

export class MiddlewareInvoker {
    readonly middleware: Middleware;
    private __next: MiddlewareInvoker;
    private static emptyFunc = () => { return; };

    constructor(middleware: Middleware) {
        this.middleware = middleware;
    }

    next(middleware: Middleware) {
        if (this.__next) {
            this.__next.next(middleware);
            return;
        }

        this.__next = new MiddlewareInvoker(middleware);
    }

    invoke<TContext extends InvokeContext>(method: string, context: TContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        const nextFunc = this.__next ? Utility.createDelegate2(this.__next, this.__next.invoke, [method, context, callback]) : callback;

        if (typeof this.middleware[method] === "function")
            this.middleware[method](context, nextFunc);
        else
            nextFunc();
    }
}