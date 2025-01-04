import {Router} from "express";
import stackRouter from "./stack";
import storeRouter from "./store";

const routes: {path: string, route: Router}[] = [
    {path: '/stack', route: stackRouter},
    {path: '/store', route: storeRouter},
];

export default routes;