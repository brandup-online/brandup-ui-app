import { ApplicationBuilder } from "brandup-ui-app";
import { TestMiddleware } from "./middlewares/test";
import "./styles.less";

const builder = new ApplicationBuilder();

builder.useMiddleware(new TestMiddleware());

const app = builder.build({ basePath: "/" }, {});

app.init();
app.load();