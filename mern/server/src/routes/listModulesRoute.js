import express from "express";

export function createListModulesRoute({ listModulesController }) {
    const router = express.Router();

    router.get("/", listModulesController);

    return router;
}