import express from "express";

export function createListModulesRoute({ ListModulesController }) {
    const router = express.Router();

    router.get("/", ListModulesController);

    return router;
}