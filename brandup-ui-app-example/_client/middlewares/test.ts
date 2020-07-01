import { Middleware, NavigateContext, NavigatingContext } from "brandup-ui-app";

export class TestMiddleware extends Middleware {
    start(_context, next) {
        console.log("start");

        next();
    }

    loaded(_context, next) {
        console.log("loaded");

        next();
    }
    navigating(context: NavigatingContext, next) {
        context.isCancel = true;

        next();
    }

    navigate(context: NavigateContext, _next) {
        context.items["test"] = "test";

        if (context.replace)
            location.replace(context.url);
        else
            location.assign(context.url);

        return;
    }

    stop(_context, next) {
        console.log("stop");

        next();
    }
}