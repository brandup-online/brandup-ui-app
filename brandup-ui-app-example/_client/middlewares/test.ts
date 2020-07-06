import { Middleware, NavigateContext, NavigatingContext, SubmitContext } from "brandup-ui-app";

export class TestMiddleware extends Middleware {
    start(_context, next) {
        console.log("middleware start");

        next();
    }

    loaded(_context, next) {
        console.log("middleware loaded");

        //alert(this.app.uri("test", { test: "test" }));

        next();
    }

    navigating(context: NavigatingContext, next) {
        console.log("middleware navigating");

        setTimeout(() => {
            //throw new Error("test");

            next();
        }, 1000);

        //context.isCancel = true;
    }
    navigate(context: NavigateContext) {
        console.log("middleware navigate");

        context.items["test"] = "test";

        if (context.replace)
            location.replace(context.url);
        else
            location.assign(context.url);

        return;
    }

    submit(context: SubmitContext, next) {
        next();

        context.form.submit();
    }

    stop(_context, next) {
        console.log("middleware stop");

        next();
    }
}