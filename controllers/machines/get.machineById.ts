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

const getMachineByIdController = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machines, getMachineByIdController]', `Get Machine by Id No Auth`);
    const { id_maquina } = req.params;
    try {
        const machine = await Calibration.findById(id_maquina).populate('foto_equipo', '-__v').populate({ path: 'foto_equipo', populate: { path: 'createdBy', model: 'User' } }).populate('foto_etiqueta_calibracion', '-__v').populate({ path: 'foto_etiqueta_calibracion', populate: { path: 'createdBy', model: 'User' } });
        logger.info('[Machines, getMachineByIdController], Success');
        res.json(machine);
    } catch (error) {
        logger.error('[Machines, getMachineByIdController]', error)
        res.json(dataBase);
    }
}

export default getMachineByIdController;