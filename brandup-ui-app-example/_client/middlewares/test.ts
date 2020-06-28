import { Middleware, NavigateContext } from "brandup-ui-app";
import { WebsiteModel } from "../typings/app";

export class TestMiddleware extends Middleware<WebsiteModel> {
    start(_context, next) {
        console.log("start");

        next();
    }

    navigate(context: NavigateContext) {
        if (context.replace)
            location.replace(context.url);
        else
            location.assign(context.url);

        return;
    }
}