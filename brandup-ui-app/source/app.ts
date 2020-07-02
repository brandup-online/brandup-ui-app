import { UIElement } from "brandup-ui";
import { EnvironmentModel, ApplicationModel, NavigationOptions, NavigationStatus } from "./common";
import { Middleware, NavigatingContext } from "./middleware";
import { MiddlewareInvoker } from "./middlewares/invoker";
import { CoreMiddleware } from "./middlewares/core";

export class Application<TModel extends ApplicationModel = {}> extends UIElement {
    readonly env: EnvironmentModel;
    readonly model: TModel;
    private middlewareInvoker: MiddlewareInvoker;
    private __isInit = false;
    private __isLoad = false;
    private __isDestroy = false;

    constructor(env: EnvironmentModel, model: TModel, middlewares: Array<Middleware<TModel>>) {
        super();

        this.env = env;
        this.model = model;

        this.setElement(document.body);

        const core = new CoreMiddleware();
        core.bind(this);
        this.middlewareInvoker = new MiddlewareInvoker(core);

        if (middlewares && middlewares.length > 0) {
            middlewares.forEach((m) => {
                m.bind(this);

                this.middlewareInvoker.next(m);
            });
        }
    }

    get typeName(): string { return "Application" }

    start(callback?: (app: Application) => void) {
        if (this.__isInit)
            return;
        this.__isInit = true;

        console.log("app starting");

        this.middlewareInvoker.invokeStart({
            items: {}
        }, () => {
            console.log("app started");

            if (callback)
                callback(this);
        });
    }
    load(callback?: (app: Application) => void) {
        if (!this.__isInit)
            throw "Before executing the load method, you need to execute the init method.";

        if (this.__isLoad)
            return;
        this.__isLoad = true;

        console.log("app loading");

        this.middlewareInvoker.invokeLoaded({
            items: {}
        }, () => {
            console.log("app loaded");

            if (callback)
                callback(this);
        });
    }
    destroy(callback?: (app: Application) => void) {
        if (this.__isDestroy)
            return;
        this.__isDestroy = true;

        console.log("app destroing");

        this.middlewareInvoker.invokeStop({
            items: {}
        }, () => {
            console.log("app stopped");

            if (callback)
                callback(this);
        });
    }

    uri(path?: string, queryParams?: { [key: string]: string }): string {
        let url = this.env.basePath;
        if (path) {
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

        if (!options.callback)
            options.callback = () => { return; };

        if (url) {
            if (url.startsWith("http") && !url.startsWith(`${location.protocol}//${location.host}`)) {
                options.callback(NavigationStatus.External);

                location.href = url;
                return;
            }
        }
        else
            url = location.href;

        const hashIndex = url.lastIndexOf("#");
        if (hashIndex > 0) {
            url = url.substr(0, hashIndex);
            hash = url.substr(hashIndex + 1);
        }

        if (hash && hash.startsWith("#")) {
            hash = hash.substr(1);
        }

        let fullUrl = url;
        if (hash)
            fullUrl += "#" + hash;

        let navStatus: NavigationStatus;

        try {
            console.log(`app navigating: ${fullUrl}`);

            const navigatingContext: NavigatingContext = {
                items: {},
                fullUrl: fullUrl,
                url,
                hash,
                replace,
                isCancel: false
            };
            this.middlewareInvoker.invokeNavigating(navigatingContext);

            if (navigatingContext.isCancel) {
                navStatus = NavigationStatus.Cancelled;

                console.log(`app navigate cancelled: ${fullUrl}`);
            }
            else {
                console.log(`app navigate: ${fullUrl}`);

                this.middlewareInvoker.invokeNavigate({
                    items: {},
                    fullUrl: fullUrl,
                    url,
                    hash,
                    replace
                });

                navStatus = NavigationStatus.Success;
            }
        }
        catch {
            navStatus = NavigationStatus.Error;
        }

        options.callback(navStatus);
    }
    reload() {
        this.nav({ url: null, replace: true });
    }
}