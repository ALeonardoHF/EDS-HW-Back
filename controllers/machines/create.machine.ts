import { Request, Response } from 'express';
import config from '@config';
const { entityCreate, dataBase } = config.message;
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import { Attachment, Calibration } from '@models';
import { TimeLine } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';
interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}

const createMachineController = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machines, createMachineController]', `User:${req?.user?.email} Add new Machine`);
    let attachment1;
    let attachment2;
    //@ts-expect-error
    const foto_equipo = req?.files?.foto_equipo;

    //@ts-expect-error
    const foto_etiqueta_calibracion = req?.files?.foto_etiqueta_calibracion;

    // const {foto_equipo, foto_etiqueta_calibracion} = req.files as Express.Multer.File[]
    
    const { id_maquina, nomMaquina, serial, manufacturador, 
                proveedor, type, loc1, loc2, loc3, last_calibration_date,
                calibration_interval_define, expira, rango_trabajo, comments,
                liga_certificado } = req.body;
    try {
        const dateLastCalibDate = dayjs(last_calibration_date).toDate()
        const dateExpira = dayjs(expira).toDate()

        if(foto_equipo) {
            const attachmentData = {
                name: `${foto_equipo[0]?.originalname}`,
                category: 'userAttachment',
                fileType: foto_equipo[0]?.filename?.split('.')[1],
                file: foto_equipo[0]?.path,
                createdBy: req?.user?._id
            }
            attachment1 = await new Attachment(attachmentData);
        }
        
        if(foto_etiqueta_calibracion) {
            const attachmentData2 = {
                name: `${foto_etiqueta_calibracion[0]?.originalname}`,
                category: 'userAttachment',
                fileType: foto_etiqueta_calibracion[0]?.filename?.split('.')[1],
                file: foto_etiqueta_calibracion[0]?.path,
                createdBy: req?.user?._id
            }
            attachment2 = await new Attachment(attachmentData2);
        }
        

        
        

        const calibration = new Calibration({
            id_maquina, nomMaquina, serial, manufacturador, 
                proveedor, type, loc1, loc2, loc3, last_calibration_date: dateLastCalibDate,
                calibration_interval_define, expira: dateExpira, rango_trabajo, comments,
                liga_certificado,foto_equipo: attachment1?._id ,foto_etiqueta_calibracion: attachment2?._id
                
        });

        await attachment1?.save();
        await attachment2?.save();
        await calibration.save();
        

        const event = {
            date: dayjs().toDate(),
            actionType: 'CREATE',
            target: 'Machine',
            actionBy: req.user._id,
            actionDescription: `Maquina ${calibration.id_maquina} ${calibration.nomMaquina} Creado`,
            es: `Maquina ${calibration.id_maquina} ${calibration.nomMaquina} Creado`,
            en: `Machine ${calibration.id_maquina} ${calibration.nomMaquina} was created`
        }
        logger.info('[Machine, createMachineController] Succesfully')
        await TimeLine.create(event);
        return res.json(entityCreate);
    } catch (error) {
        logger.error('[Machines, createMachineController]', ` User:${req.user.email} `, error)
        res.json(dataBase)
    }
}

export default createMachineController;