import { RealtimeMiddleware } from "../middlewares/realtime";
import { PageModel } from "./base";

export default class IndexModel extends PageModel {
    get typeName(): string { return "IndexModel" }
    get header(): string { return "Main" }

    protected _onRenderElement(element: HTMLElement) {
        super._onRenderElement(element);

        this.app.middleware(RealtimeMiddleware).subscribe("main");
    }
}