import { Application, AppClientModel, PageNavState } from "brandup-ui-app";
import "./styles.less";

if (!window["dataLayer"])
    window["dataLayer"] = [];

const dataLayer: Array<object> = window["dataLayer"];

export const appManager = Application.setup<WebsiteClientModel>({
    configure: (builder) => {
        //builder.addPageType("page", () => import("./pages/base"));
    }
}, (app) => {
    let referUrl: string = null;
    app.addEventListener("pageNavigating", () => {
        document.body.classList.remove("app-state-main-menu");
        referUrl = location.href;
    });

    app.addEventListener("pageLoaded", (e: CustomEvent) => {
        if (referUrl === null)
            return;

        const s = e.detail as PageNavState;

        dataLayer.push({
            'event': 'VirtualPageView',
            'virtualPageURL': s.url,
            'virtualPagePath': s.path,
            'virtualPageTitle': s.title,
            'virtualPageReferer': referUrl
        });

        referUrl = null;
    });

    app.element.addEventListener("invalid", (event: Event) => {
        event.preventDefault();

        const elem = event.target as HTMLInputElement;
        elem.classList.add("invalid");

        if (elem.hasAttribute("data-val-required")) {
            elem.classList.add("invalid-required");
        }
    }, true);

    app.element.addEventListener("change", (event: Event) => {
        const elem = event.target as HTMLInputElement;
        elem.classList.remove("invalid");

        if (elem.hasAttribute("data-val-required")) {
            elem.classList.remove("invalid-required");
        }
    });
});

interface WebsiteClientModel extends AppClientModel {
}