import { h, render, Component } from "preact";
import ReactifyCore from "reactify-core";
import Router, {route} from "preact-router";
import AsyncRoute from "preact-async-route";
import ErrorPage from "../../error/components/index";
import routes from "./routes";

function renderPage() {
    const contentEl = document.getElementById("content");
    if (!contentEl) return;

    let dataBE = document.getElementById("dataBE").value;

    render(
        <Router>
            {routes(dataBE)}
            <ErrorPage default data={{errStatus: 404}} />
        </Router>,
        contentEl,
        contentEl.lastElementChild
    );
}

window.docReady(() => {
    renderPage();
});
