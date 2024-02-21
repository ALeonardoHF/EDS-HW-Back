import { Request, Response } from 'express';
import qr from 'qrcode'
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';

interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

const createQR = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machines, createQR]', `User:${req.user.email} createQR`);
    const { id_maquina } = req.params;
    const url = `${process.env.CLENTURL}/guest/${id_maquina}`;
    try {

        const qrData = await qr.toBuffer(`${process.env.CLENTURL}/guest/${id_maquina}`);
        
        res.send(qrData);
      } catch (err) {
        console.error('Error generando el QR:', err);
        res.status(500).send('Error generando el QR');
      }
}

export default createQR;