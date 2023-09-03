import { ApplicationBuilder } from "brandup-ui-app";
import { PagesMiddleware } from "./middlewares/pages";
import "./styles.less";

const builder = new ApplicationBuilder();

builder
    .useMiddleware(new PagesMiddleware());

const app = builder.build({ basePath: "/" }, {});

app.start(() => { console.log("app start callback"); });
app.load(() => { console.log("app load callback"); });
app.nav({ url: null, replace: true });