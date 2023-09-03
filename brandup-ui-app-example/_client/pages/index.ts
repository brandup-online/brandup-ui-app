import { PageModel } from "./base";

export default class IndexModel extends PageModel {
    get typeName(): string { return "IndexModel" }
    get header(): string { return "Main" }
}