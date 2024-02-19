import { Request, Response } from 'express';
import config from '@config';
const { dataBase, entityUpdate } = config.message;
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import { TimeLine } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';
import fs from 'fs';
interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

const deleteMachine = async(req: RequestBody, res: Response) => {
    logger.verbose('[Machines, deleteMachineController]', `User:${req?.user?.email} action: Delete Machine`);
    const _id = req?.params?.id;
    
    try {
        const calibration = await Calibration.findByIdAndUpdate(_id, {status: false} );
        
        const event = {
            date: dayjs().toDate(),
            actionType: 'DELETE',
            target: 'Machine',
            actionBy: req.user._id,
            actionDescription: `Maquina ${calibration?.id_maquina} ${calibration?.nomMaquina} Eliminada`,
            es: `Maquina ${calibration?.id_maquina} ${calibration?.nomMaquina} Eliminada`,
            en: `Machine ${calibration?.id_maquina} ${calibration?.nomMaquina} was deleted`
        }
        TimeLine.create(event)
        logger.info('[Machines, deleteMachineController] Succesfully')
        res.json(entityUpdate)
    } catch (error) {
        logger.error('[Machines, deleteMachineController]', ` User:${req?.user?.email} `, error)
        res.status(501).json(dataBase);
    }
}

export default deleteMachine;