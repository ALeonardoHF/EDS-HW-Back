import { Request, Response } from 'express';
import config from '@config';
const { entityCreate, dataBase } = config.message;
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';

interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

const getMachineController = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machines, getMachineController]', `User:${req.user.email} Get Machine by Id`);
    const { id_maquina } = req.params;
    try {
        const machine = await Calibration.findById(id_maquina).populate('foto_equipo', '-__v').populate({ path: 'foto_equipo', populate: { path: 'createdBy', model: 'User' } }).populate('foto_etiqueta_calibracion', '-__v').populate({ path: 'foto_etiqueta_calibracion', populate: { path: 'createdBy', model: 'User' } });
        logger.info('[Machines, getMachineController]', `User:${req.user.email} Success`);
        res.json(machine);
    } catch (error) {
        logger.error('[Machines, getMachineController]', ` User:${req.user.email} `, error)
        res.json(dataBase);
    }
}

export default getMachineController;