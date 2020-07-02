import { ApplicationModel } from "./common";
import { Application } from "./app";

export class Middleware<TModel extends ApplicationModel = {}> {
    private _app: Application<TModel>;

    get app(): Application<TModel> { return this._app; }

    bind(app: Application<TModel>) {
        this._app = app;
    }

    start(_context: StartContext, next: () => void) {
        next();
    }
    loaded(_context: LoadContext, next: () => void) {
        next();
    }
    navigating(_context: NavigatingContext, next: () => void) {
        next();
    }
    navigate(_context: NavigateContext, next: () => void) {
        next();
    }
    stop(_context: StopContext, next: () => void) {
        next();
    }
}

export interface StartContext {
    readonly items: { [key: string]: any };
}

export interface LoadContext {
    readonly items: { [key: string]: any };
}

export interface NavigatingContext {
    readonly items: { [key: string]: any };
    readonly fullUrl: string;
    readonly url: string;
    readonly hash: string;
    readonly replace: boolean;
    readonly context: { [key: string]: any };
    isCancel: boolean;
}

export interface NavigateContext {
    readonly items: { [key: string]: any };
    readonly fullUrl: string;
    readonly url: string;
    readonly hash: string;
    readonly replace: boolean;
    readonly context: { [key: string]: any };
}

export interface StopContext {
    readonly items: { [key: string]: any };
}