import { ApplicationBuilder } from "brandup-ui-app";
import { TestMiddleware } from "./middlewares/test";
import "./styles.less";
import { WebsiteModel } from "./typings/app";

const builder = new ApplicationBuilder();

builder.useMiddleware(new TestMiddleware());

const app = builder.build<WebsiteModel>({ basePath: "/" }, {});

app.init();
app.load();