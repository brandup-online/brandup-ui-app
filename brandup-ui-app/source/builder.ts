import { ApplicationModel, EnvironmentModel } from "./common";
import { Middleware } from "./middleware";
import { Application } from "./app";

export class ApplicationBuilder {
    private __middlewares: Array<Middleware> = [];

    useMiddleware(middleware: Middleware) {
        if (!middleware)
            throw `Middleware propery is required.`;

        this.__middlewares.push(middleware);
    }

    build(env: EnvironmentModel, model: ApplicationModel) {
        return new Application(env, model, this.__middlewares);
    }
}