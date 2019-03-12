import _ from "lodash";
import express, { Request, Response } from "express";
import { spawn, exec } from "child_process";
import config from "../config";
import { asyncMiddleware } from "./utils";
import { UserError } from "./errors";

const router = express.Router();

const jobs: Job[] = [];

class Job {
    public readonly inputPort: number;
    public readonly replayPort: number;
    public readonly pid: number;
}

/**
 * @swagger
 * /jobs:
 *   post:
 *     tags:
 *     - Job
 *     summary: Creates a new proxy which listens and replays at specified ports
 *     requestBody:
 *       description: Describes a new job
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *           $ref: '#/components/Job'
 *     responses:
 *       '201':
 *          description: Created
 */
router.post("/jobs", asyncMiddleware(async (req: Request, res: Response) => {
    const inputPort = req.body.inputPort;
    const replayPort = req.body.replayPort;

    if (!_.isNumber(inputPort)) {
        throw new UserError(400, "inputPort must be a valid number");
    }

    if (!_.isNumber(replayPort)) {
        throw new UserError(400, "replayPort must be a valid number");
    }

    const args: string[] = [
        `${config.gorExecutable}`,
        "--input-raw", `:${inputPort}`,
        "--input-raw-track-response",
        "--output-http-track-response",
        "--output-http", `http://localhost:${replayPort}`];

    const cp = spawn("sudo", args, { detached: true, stdio: [ "ignore" ]});
    cp.unref();

    const job: Job = {
        inputPort,
        replayPort,
        pid: cp.pid,
    };

    jobs.push(job);

    res.status(201);
    res.json(job);
}));

/**
 * @swagger
 * /jobs:
 *   delete:
 *     tags:
 *     - Job
 *     summary: Stops all jobs
 *     responses:
 *       '202':
 *          description: Success
 */
router.delete("/jobs", (req: Request, res: Response) => {
    while (jobs.length > 0) {
        exec(`sudo kill -9 ${jobs.pop()!.pid}`);
    }
    res.status(202).send();
});

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags:
 *     - Job
 *     summary: Returns all jobs
 *     responses:
 *       '200':
 *          description: Success
 */
router.get("/jobs", (req: Request, res: Response) => {
    res.status(200).json(jobs);
});

export default router;
