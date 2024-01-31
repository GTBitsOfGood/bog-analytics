import { relogRequestHandler } from "@/middleware/request-middleware";
import { RequestHandler } from "express"

export const healthWrapper: RequestHandler = async (req, res) => {
    return res.status(200).json({
        success: true,
        payload: {}
    })
}

export const health = relogRequestHandler(healthWrapper);