import { Middleware, StartContext, LoadContext, NavigateContext, StopContext } from "../middleware";
import { ApplicationModel } from "../common";
import { Utility } from "brandup-ui";

export class MiddlewareInvoker {
    readonly middleware: Middleware<ApplicationModel>;
    private nextInvoker: MiddlewareInvoker;
    private static emptyFunc = () => { return; };

    constructor(middleware: Middleware<ApplicationModel>) {
        this.middleware = middleware;
    }

    next(middleware: Middleware<ApplicationModel>) {
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

    invokeNavigate(context: NavigateContext) {
        this.middleware.navigate(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeNavigate, [context]) : MiddlewareInvoker.emptyFunc);
    }

    invokeStop(context: StopContext) {
        this.middleware.stop(context, this.nextInvoker ? Utility.createDelegate2(this.nextInvoker, this.nextInvoker.invokeStop, [context]) : MiddlewareInvoker.emptyFunc);
    }
}