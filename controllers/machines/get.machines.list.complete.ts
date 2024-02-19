import { Request, Response } from 'express';
import config from '@config';
const { entityCreate, dataBase } = config.message;
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';
const ObjectId = require('mongoose').Types.ObjectId

interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

/**
 * This method is for get a list of Users
 * @param {number} since
 * @param {number} limit
 * @param {boolean} status   
 * @return {json} json String
 */

const listAllMachineController = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machine, listAllMachineController]', `User:${req.user.email} action:Get All Machine List`)
    let page = req.query.page || 1;
    const { limit = 10, search = "", role = "" } = req.query;
    let query = []
    page = Number(page) - 1;
    const since = page * 10;

    // TODO campos calibration
    //if (search) query.push({ $or: [{ id_maquina: { $regex: `${search}`, $options: 'i' } }, { nomMaquina: { $regex: `${search}`, $options: 'i' } }, { email: { $regex: `${search}`, $options: 'i' } }] })
    
    // query.push({ status: true })
    // query.push({ status: false })
    const [total, machine] = await Promise.all([
        Calibration.countDocuments(),
        Calibration.find()
            .skip(Number(since))
            .limit(Number(limit))
    ])
    logger.info('[Machine, listAllMachineController] Succesfully')
    res.json({ total, machine });
}

export default listAllMachineController;