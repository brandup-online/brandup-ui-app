import { Middleware, StartContext, LoadContext, NavigatingContext, NavigateContext, StopContext } from "../middleware";
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

    invokeStart(context: StartContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        const nextFunc = this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeStart, [context, callback]) : callback;

        this.middleware.start(context, nextFunc);
    }

    invokeLoaded(context: LoadContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        this.middleware.loaded(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeLoaded, [context, callback]) : callback);
    }

    invokeNavigating(context: NavigatingContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        this.middleware.navigating(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeNavigating, [context, callback]) : callback);
    }

    invokeNavigate(context: NavigateContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        this.middleware.navigate(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeNavigate, [context, callback]) : callback);
    }

    invokeStop(context: StopContext, callback?: () => void) {
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;

        this.middleware.stop(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeStop, [context, callback]) : callback);
    }
}