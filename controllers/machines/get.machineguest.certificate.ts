import { Request, Response } from 'express';
import config from '@config';
const { entityCreate, dataBase } = config.message;
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import { TimeLine } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';
import fs from 'fs'
import path from 'path'
const { paramsError } = config.message;

interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

const getMachineGuestCertificateController = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machines, getMachineGuestCertificate]');
    const machineId = req.params.cerId;
    try {
        const machine = await Calibration.findById(machineId);
        const certificado = await Attachment.findById(machine?.certificado)
        const filePath = `${certificado?.file}`;
        fs.access(filePath, error => {
            if (error) res.status(404).json(paramsError)
            else {
                res.sendFile(path.resolve(filePath));
            }
        })
    } catch (error) {
        logger.error('[Machines, getMachineGuestCertificate]', error)
        res.status(501).json(null);
    }
}

export default getMachineGuestCertificateController
