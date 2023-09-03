import { UIElement } from "brandup-ui";
import { DOM } from "brandup-ui-dom";

export abstract class PageModel extends UIElement {
    abstract get header(): string;

    constructor(containerElement: HTMLElement) {
        super();

        this.setElement(containerElement);
    }

    protected _onRenderElement(element: HTMLElement) {
        element.appendChild(DOM.tag("header", "page-header", [
            DOM.tag("h1", null, this.header)
        ]));
    }

    destroy() {
        DOM.empty(this.element);

        super.destroy();
    }
}