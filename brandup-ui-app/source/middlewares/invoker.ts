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

    invokeStart(context: StartContext) {
        const nextFunc = this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeStart, [context]) : MiddlewareInvoker.emptyFunc;

        this.middleware.start(context, nextFunc);
    }

    invokeLoaded(context: LoadContext) {
        this.middleware.loaded(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeLoaded, [context]) : MiddlewareInvoker.emptyFunc);
    }

    invokeNavigating(context: NavigatingContext) {
        this.middleware.navigating(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeNavigating, [context]) : MiddlewareInvoker.emptyFunc);
    }

    invokeNavigate(context: NavigateContext) {
        this.middleware.navigate(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeNavigate, [context]) : MiddlewareInvoker.emptyFunc);
    }

    invokeStop(context: StopContext) {
        this.middleware.stop(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeStop, [context]) : MiddlewareInvoker.emptyFunc);
    }
}