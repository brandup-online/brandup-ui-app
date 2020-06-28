import { UIElement } from "brandup-ui";
import { ApplicationModel, IApplication, NavigationOptions, EnvironmentModel } from "./common";
import { Middleware } from "./middleware";
import { MiddlewareInvoker } from "./middlewares/invoker";
import { CoreMiddleware } from "./middlewares/core";

export class Application<TModel extends ApplicationModel> extends UIElement implements IApplication {
    readonly env: EnvironmentModel;
    readonly model: TModel;
    private middlewareInvoker: MiddlewareInvoker;

    constructor(env: EnvironmentModel, model: TModel, middlewares: Array<Middleware<TModel>>) {
        super();

        this.env = env;
        this.model = model;

        const core = new CoreMiddleware();
        core.bind(this);
        this.middlewareInvoker = new MiddlewareInvoker(core);

        if (middlewares && middlewares.length > 0) {
            middlewares.forEach((m) => {
                m.bind(this);

                this.middlewareInvoker.next(m);
            });
        }

        this.setElement(document.body);
    }

    get typeName(): string { return "Application" }

    init() {
        this.middlewareInvoker.invokeStart({});
        console.log("app started");
    }
    load() {
        this.middlewareInvoker.invokeLoaded({});
        console.log("app loaded");
    }
    destroy() {
        this.middlewareInvoker.invokeStop({});
        console.log("app stopped");
    }

    uri(path?: string, queryParams?: { [key: string]: string }): string {
        let url = this.model.baseUrl;
        if (path)
        {
            if (path.substr(0, 1) === "/")
                path = path.substr(1);
            url += path;
        }

        if (queryParams) {
            let query = "";
            let i = 0;
            for (const key in queryParams) {
                const value = queryParams[key];
                if (value === null || typeof value === "undefined")
                    continue;

                if (i > 0)
                    query += "&";

                query += key;

                if (value)
                    query += "=" + value;

                i++;
            }

            if (query)
                url += "?" + query;
        }

        return url;
    }

    nav(options: NavigationOptions) {
        let { url } = options;
        const { replace } = options;
        let hash: string = null;

        if (url && url.startsWith(location.protocol) && !url.startsWith(`${location.protocol}//${location.host}`)) {
            location.href = url;
            return;
        }

        if (!url)
            url = location.href;

        const hashIndex = url.lastIndexOf("#");
        if (hashIndex > 0) {
            url = url.substr(0, hashIndex);
            hash = url.substr(hashIndex + 1);
        }

        if (hash && hash.startsWith("#")) {
            hash = hash.substr(1);
        }

        this.middlewareInvoker.invokeNavigate({ url, hash, replace });

        if (options.success)
            options.success();
    }
    reload() {
        this.nav({ url: null, replace: true });
    }
}