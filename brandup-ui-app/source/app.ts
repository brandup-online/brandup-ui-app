import { UIElement } from "brandup-ui";
import { EnvironmentModel, ApplicationModel, NavigationOptions, NavigationStatus, SubmitOptions } from "./common";
import { Middleware, NavigatingContext } from "./middleware";
import { MiddlewareInvoker } from "./invoker";

const formClassName = "appform";
const loadingLinkClass = "loading";
const navUrlClassName = "applink";
const navUrlAttributeName = "data-nav-url";
const navReplaceAttributeName = "data-nav-replace";
const navIgnoreAttributeName = "data-nav-ignore";

export class Application<TModel extends ApplicationModel = {}> extends UIElement {
    readonly env: EnvironmentModel;
    readonly model: TModel;
    private __invoker: MiddlewareInvoker;
    private __isInit = false;
    private __isLoad = false;
    private __isDestroy = false;
    private __clickFunc: (e: MouseEvent) => void;
    private __keyDownUpFunc: (e: KeyboardEvent) => void;
    private __submitFunc: (e: Event) => void;
    private _ctrlPressed = false;

    constructor(env: EnvironmentModel, model: TModel, middlewares: Array<Middleware<TModel>>) {
        super();

        this.env = env;
        this.model = model;

        this.setElement(document.body);

        const core = new Middleware();
        core.bind(this);
        this.__invoker = new MiddlewareInvoker(core);

        if (middlewares && middlewares.length > 0) {
            middlewares.forEach((m) => {
                m.bind(this);

                this.__invoker.next(m);
            });
        }
    }

    get invoker(): MiddlewareInvoker { return this.__invoker; }
    get typeName(): string { return "Application" }

    start(callback?: (app: Application) => void) {
        if (this.__isInit)
            return;
        this.__isInit = true;

        console.log("app starting");

        window.addEventListener("click", this.__clickFunc = (e: MouseEvent) => this.__onClick(e), false);
        window.addEventListener("keydown", this.__keyDownUpFunc = (e: KeyboardEvent) => this.__onKeyDownUp(e), false);
        window.addEventListener("keyup", this.__keyDownUpFunc, false);
        window.addEventListener("submit", this.__submitFunc = (e: Event) => this.__onSubmit(e), false);

        this.__invoker.invoke("start", {
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

        this.__invoker.invoke("loaded", {
            items: {}
        }, () => {
            console.log("app loaded");

            if (callback)
                callback(this);

            this.endLoadingIndicator();
        });
    }
    destroy(callback?: (app: Application) => void) {
        if (this.__isDestroy)
            return;
        this.__isDestroy = true;

        console.log("app destroing");

        window.removeEventListener("click", this.__clickFunc, false);
        window.removeEventListener("keydown", this.__keyDownUpFunc, false);
        window.removeEventListener("keyup", this.__keyDownUpFunc, false);
        window.removeEventListener("submit", this.__submitFunc, false);

        this.__invoker.invoke("stop", {
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

                query += encodeURIComponent(key);

                if (value)
                    query += "=" + encodeURIComponent(value);

                i++;
            }

            if (query)
                url += "?" + query;
        }

        return url;
    }

    nav(options: NavigationOptions) {
        let { url, context, callback } = options;
        const { replace } = options;
        let hash: string = null;

        if (!callback)
            callback = () => { return; };

        if (!context)
            context = {};

        if (url) {
            if (url.startsWith("http") && !url.startsWith(`${location.protocol}//${location.host}`)) {
                callback({ status: NavigationStatus.External, context });

                location.href = url;
                return;
            }
        }
        else
            url = location.href;

        const hashIndex = url.lastIndexOf("#");
        if (hashIndex > 0) {
            hash = url.substr(hashIndex + 1);
            url = url.substr(0, hashIndex);
        }

        if (hash && hash.startsWith("#")) {
            hash = hash.substr(1);
        }

        let fullUrl = url;
        if (hash)
            fullUrl += "#" + hash;

        try {
            console.log(`app navigating: ${fullUrl}`);

            this.beginLoadingIndicator();

            const navigatingContext: NavigatingContext = {
                items: {},
                fullUrl: fullUrl,
                url,
                hash,
                replace,
                context,
                isCancel: false
            };
            this.__invoker.invoke("navigating", navigatingContext, () => {
                if (navigatingContext.isCancel) {
                    console.log(`app navigate cancelled: ${fullUrl}`);

                    callback({ status: NavigationStatus.Cancelled, context });
                    this.endLoadingIndicator();
                    return;
                }
                else {
                    console.log(`app navigate: ${fullUrl}`);

                    this.__invoker.invoke("navigate", {
                        items: {},
                        fullUrl: fullUrl,
                        url,
                        hash,
                        replace,
                        context
                    }, () => {
                            callback({ status: NavigationStatus.Success, context });
                            this.endLoadingIndicator();
                        });

                    return;
                }
            });
        }
        catch (e) {
            console.error("navigation error");
            console.error(e);

            callback({ status: NavigationStatus.Error, context });
            this.endLoadingIndicator();
        }
    }
    submit(options: SubmitOptions) {
        const { form } = options;
        let { context, callback } = options;

        if (!callback)
            callback = () => { return; };

        if (!context)
            context = {};

        console.log(`form sibmiting`);

        if (form.classList.contains(loadingLinkClass))
            return false;
        form.classList.add(loadingLinkClass);

        const complexCallback = () => {
            form.classList.remove(loadingLinkClass);

            callback({ context });

            this.endLoadingIndicator();

            console.log(`form sibmited`);
        };

        this.beginLoadingIndicator();

        if (form.method === "get") {
            const formData = new FormData(form);
            const p = new Array<string>();
            formData.forEach((v, k) => { p.push(`${encodeURIComponent(k)}=${encodeURIComponent(v.toString())}`) });
            const queryParams = p.join('&');

            let url = form.action ? form.action : location.href;
            const urlHashIndex = url.lastIndexOf("#");
            if (urlHashIndex > 0)
                url = url.substr(0, urlHashIndex);

            if (queryParams) {
                if (url.lastIndexOf("?") === -1)
                    url += "?";

                url += queryParams;
            }

            this.nav({
                url,
                replace: form.hasAttribute(navReplaceAttributeName),
                callback: complexCallback
            });
            return;
        }

        this.__invoker.invoke("submit", {
            items: {},
            form
        }, complexCallback);
    }
    reload() {
        this.nav({ url: null, replace: true });
    }

    private __onClick(e: MouseEvent) {
        let elem = e.target as HTMLElement;
        let ignore = false;
        while (elem) {
            if (elem.hasAttribute(navIgnoreAttributeName)) {
                ignore = true;
                break;
            }

            if (elem.classList && elem.classList.contains(navUrlClassName))
                break;
            if (elem === e.currentTarget)
                return;

            if (typeof elem.parentElement === "undefined")
                elem = elem.parentNode as HTMLElement;
            else
                elem = elem.parentElement;

            if (!elem)
                return true;
        }

        if (this._ctrlPressed)
            return true;

        if (elem.hasAttribute("target")) {
            if (elem.getAttribute("target") === "_blank")
                return true;
        }

        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;

        if (ignore)
            return false;

        let url: string = null;
        if (elem.tagName === "A")
            url = elem.getAttribute("href");
        else if (elem.hasAttribute(navUrlAttributeName))
            url = elem.getAttribute(navUrlAttributeName);
        else
            throw "Не удалось получить Url адрес для перехода.";

        if (elem.classList.contains(loadingLinkClass))
            return false;
        elem.classList.add(loadingLinkClass);

        this.nav({
            url,
            replace: elem.hasAttribute(navReplaceAttributeName),
            callback: () => { elem.classList.remove(loadingLinkClass); }
        });

        return false;
    }
    private __onKeyDownUp(e: KeyboardEvent) {
        this._ctrlPressed = e.ctrlKey;
    }
    private __onSubmit(e: Event) {
        const form = e.target as HTMLFormElement;
        if (!form.classList.contains(formClassName))
            return;
        if (!form.checkValidity() && !form.noValidate)
            return;

        e.preventDefault();

        this.submit({
            form,
            context: {
                event: e
            }
        });
    }

    private __loadingCounter = 0;
    beginLoadingIndicator() {
        this.__loadingCounter++;

        document.body.classList.remove("bp-state-loaded");
        document.body.classList.add("bp-state-loading");
    }
    endLoadingIndicator() {
        this.__loadingCounter--;
        if (this.__loadingCounter < 0)
            this.__loadingCounter = 0;

        if (this.__loadingCounter <= 0) {
            document.body.classList.remove("bp-state-loading");
            document.body.classList.add("bp-state-loaded");
        }
    }
}