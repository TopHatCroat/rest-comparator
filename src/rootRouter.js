import _ from 'lodash';
import express from "express";
import cp from 'child-process-promise';

const router = express.Router();

const jobs = [];

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
router.post("/jobs", async (req, res) => {
    const inputPort = req.body.inputPort;
    const replayPort = req.body.replayPort;

    if(!_.isNumber(inputPort)) {
        throw new Error('inputPort must be a valid number');
    }

    if(!_.isNumber(replayPort)) {
        throw new Error('replayPort must be a valid number');
    }

    const proc = await cp.spawn(`sudo gor --input-raw :${inputPort} \
                                    --input-raw-track-response \
                                    --output-http-track-response \
                                    --middleware "./dist/index.js ${config.dbPath} \
                                    --output-http http://localhost:${replayPort}`
    );

    const job = {
        inputPort,
        replayPort,
        pid: proc.pid
    };

    jobs.push(job);

    res.status(201);
    res.json(job);
});

/**
 * @swagger
 * /jobs:
 *   delete:
 *     tags:
 *     - Job
 *     summary: Stops all jobs
 *     responses:
 *       '200':
 *          description: Success
 */
router.delete("/jobs", async (req, res) => {
    const killList = jobs.map(job => {
       cp.exec(`kill -9 ${job.pid}`);
    });

    return await Promise.all(killList)
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
router.get("/status", async (req, res) => {
    res.json({
        jobs,
    });
});

export default router;