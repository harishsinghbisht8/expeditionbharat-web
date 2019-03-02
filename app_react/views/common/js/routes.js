import { h, render, Component } from "preact";
import AsyncRoute from "preact-async-route";


function getHomeComponent() {
    return System.import(/* webpackChunkName : "home" */ "../../home/components/index").then(module => module.default);
}
function getTripComponent() {
    return System.import(/* webpackChunkName : "trip" */ "../../trip/components/index").then(module => module.default);
}

export default function (dataBE) {
    const data = dataBE ? JSON.parse(dataBE) : {};
    return [
        <AsyncRoute
            path="/"
            page="home"
            prevPage=""
            hashHandled={true}
            getComponent={getHomeComponent}
            data={dataBE ? JSON.parse(dataBE) : []}
            loading={() => { return null }}
        />,
        <AsyncRoute
            path="/trip/:tripName"
            page="trip"
            prevPage="home"
            hashHandled={false}
            getComponent={getTripComponent}
            data={dataBE ? JSON.parse(dataBE) : []}
            loading={() => { return null }}
        />
        
    ];
}