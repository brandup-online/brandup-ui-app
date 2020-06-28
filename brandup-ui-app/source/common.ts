export interface EnvironmentModel {
    basePath: string;
}

export interface ApplicationModel {
    [key: string]: any;
}

export interface IApplication {
    env: EnvironmentModel;
    model: ApplicationModel;
    uri(path?: string, queryParams?: { [key: string]: string }): string;
    nav(options: NavigationOptions);
    reload();
    destroy();
}

export interface NavigationOptions {
    url: string;
    replace: boolean;
    success?: () => void;
}