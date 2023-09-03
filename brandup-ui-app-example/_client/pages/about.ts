import { DOM } from "brandup-ui-dom";
import { PageModel } from "./base";

export default class AboutModel extends PageModel {
    get typeName(): string { return "AboutModel" }
    get header(): string { return "About" }

    protected _onRenderElement(element: HTMLElement) {
        super._onRenderElement(element);

        element.appendChild( DOM.tag("p", null, "About page content."));
    }
}