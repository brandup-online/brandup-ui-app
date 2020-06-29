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
    navigate(_context: NavigateContext, next: () => void) {
        next();
    }
    stop(_context: StopContext, next: () => void) {
        next();
    }
}

export interface StartContext {
}

export interface LoadContext {
}

export interface NavigateContext {
    url: string;
    hash: string;
    replace: boolean;
}

export interface StopContext {
}