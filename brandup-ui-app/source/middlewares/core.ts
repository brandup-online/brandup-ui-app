import { Middleware } from "../middleware";
import { Utility } from "brandup-ui";
import { ApplicationModel } from "../common";

const loadingLinkClass = "loading";

export class CoreMiddleware extends Middleware<ApplicationModel> {
    private linkClickFunc: () => void;
    private keyDownUpFunc: () => void;
    private _ctrlPressed = false;

    start(_context, next: () => void) {
        this.linkClickFunc = Utility.createDelegate(this, this.__onClickAppLink);
        this.keyDownUpFunc = Utility.createDelegate(this, this.__onKeyDownUp);

        window.addEventListener("click", this.linkClickFunc, false);
        window.addEventListener("keydown", this.keyDownUpFunc, false);
        window.addEventListener("keyup", this.keyDownUpFunc, false);

        next();
    }
    navigate(_context, next: () => void) {
        document.body.classList.remove("bp-state-loaded");
        document.body.classList.add("bp-state-loading");

        next();

        document.body.classList.remove("bp-state-loading");
        document.body.classList.add("bp-state-loaded");
    }
    stop(_context, next: () => void) {
        window.removeEventListener("click", this.linkClickFunc, false);
        window.removeEventListener("keydown", this.keyDownUpFunc, false);
        window.removeEventListener("keyup", this.keyDownUpFunc, false);

        next();
    }

    private __onClickAppLink(e: MouseEvent) {
        let elem = e.target as HTMLElement;
        let ignore = false;
        while (elem) {
            if (elem.hasAttribute("data-nav-ignore")) {
                ignore = true;
                break;
            }

            if (elem.classList && elem.classList.contains("applink"))
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
        let replace = false;
        if (elem.tagName === "A")
            url = elem.getAttribute("href");
        else if (elem.hasAttribute("data-href"))
            url = elem.getAttribute("data-href");
        else
            throw "Не удалось получить Url адрес для перехода.";

        elem.classList.add(loadingLinkClass);

        if (elem.hasAttribute("data-nav-replace") || elem.hasAttribute("data-url-replace"))
            replace = true;

        this.app.nav({ url, replace, callback: () => { elem.classList.remove(loadingLinkClass); } });

        return false;
    }
    private __onKeyDownUp(e: KeyboardEvent) {
        this._ctrlPressed = e.ctrlKey;
    }
}