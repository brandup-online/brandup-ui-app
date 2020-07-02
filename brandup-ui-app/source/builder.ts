import { ApplicationModel, EnvironmentModel } from "./common";
import { Middleware } from "./middleware";
import { Application } from "./app";

export class ApplicationBuilder {
    private __middlewares: Array<Middleware> = [];
    private __appType = Application;

    setAppType(appType: typeof Application) {
        this.__appType = appType;
    }
    useMiddleware(middleware: Middleware) {
        if (!middleware)
            throw `Middleware propery is required.`;

        this.__middlewares.push(middleware);
    }

    build(env: EnvironmentModel, model: ApplicationModel) {
        return new this.__appType(env, model, this.__middlewares);
    }
}