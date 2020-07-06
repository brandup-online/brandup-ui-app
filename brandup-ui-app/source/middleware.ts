import { ApplicationModel } from "./common";
import { Application } from "./app";

export class Middleware<TModel extends ApplicationModel = {}> {
    private _app: Application<TModel>;

    get app(): Application<TModel> { return this._app; }

    bind(app: Application<TModel>) {
        this._app = app;
    }
}

export interface StartContext extends InvokeContext {
}

export interface LoadContext extends InvokeContext {
}

export interface NavigatingContext extends InvokeContext {
    readonly fullUrl: string;
    readonly url: string;
    readonly hash: string;
    readonly replace: boolean;
    readonly context: { [key: string]: any };
    isCancel: boolean;
}

export interface NavigateContext extends InvokeContext {
    readonly fullUrl: string;
    readonly url: string;
    readonly hash: string;
    readonly replace: boolean;
    readonly context: { [key: string]: any };
}

export interface StopContext extends InvokeContext {
}

export interface SubmitContext extends InvokeContext {
    form: HTMLFormElement;
}

export interface InvokeContext {
    readonly items: { [key: string]: any };
}