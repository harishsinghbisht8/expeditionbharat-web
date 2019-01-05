import { h, render, Component } from "preact";
import ReactifyCore from "reactify-core";
import Router, {route} from "preact-router";
import AsyncRoute from "preact-async-route";
import routes from "./routes";

function renderPage() {
    const contentEl = document.getElementById("content");
    if (!contentEl) return;

    let dataBE = document.getElementById("dataBE").value;

    render(
        <Router>
            {routes(dataBE)}
        </Router>,
        contentEl,
        contentEl.lastElementChild
    );

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker-nm.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });

        function updateOnlineStatus(event) {
            let bodyElem = document.querySelector('body');
            if (navigator.onLine) {
                bodyElem.classList.remove("offline");
            } else {
                bodyElem.classList.add("offline");
            }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }
}

window.docReady(() => {
    renderPage();
});
