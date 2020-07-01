export interface EnvironmentModel {
    basePath: string;
}

export interface ApplicationModel {
    [key: string]: any;
}

export interface NavigationOptions {
    url: string;
    replace?: boolean;
    callback?: (status: NavigationStatus) => void;
}
export enum NavigationStatus {
    Success = 1,
    Cancelled = 2,
    Error = 3,
    External = 4
}