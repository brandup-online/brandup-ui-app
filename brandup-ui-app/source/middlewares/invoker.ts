import { Middleware, InvokeContext } from "../middleware";
import { Utility } from "brandup-ui";

export class MiddlewareInvoker {
    readonly middleware: Middleware;
    private nextInvoker: MiddlewareInvoker;
    private static emptyFunc = () => { return; };

    constructor(middleware: Middleware) {
        this.middleware = middleware;
    }

    next(middleware: Middleware) {
        if (this.nextInvoker) {
            this.nextInvoker.next(middleware);
            return;
        }

        this.nextInvoker = new MiddlewareInvoker(middleware);
    }

    invoke<TContext extends InvokeContext>(method: string, context: TContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        const nextFunc = this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invoke, [method, context, callback]) : callback;

        if (typeof this.middleware[method] === "function")
            this.middleware[method](context, nextFunc);
        else
            nextFunc();
    }
}