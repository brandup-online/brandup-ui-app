import { ApplicationModel, EnvironmentModel } from "./common";
import { Middleware } from "./middleware";
import { Application } from "./app";

export class ApplicationBuilder {
    private __middlewares: Array<Middleware<ApplicationModel>> = [];

    useMiddleware(middleware: Middleware<ApplicationModel>) {
        if (!middleware)
            throw `Middleware propery is required.`;

        this.__middlewares.push(middleware);
    }

    build<TModel extends ApplicationModel>(env: EnvironmentModel, model: TModel) {
        return new Application<TModel>(env, model, this.__middlewares as Array<Middleware<TModel>>);
    }
}