import { Request, Response } from 'express';
import { Calibration } from '@models';
import dayjs = require('dayjs');
import { Calibration as CalibrationInterface } from '@interfaces/models/calibration';
import logger from "@logger"
import { User as UserInterface } from "@interfaces/models/user"
import transporter from "../../helpers/mailer"
import cron = require('node-cron')

interface RequestBody extends Request {
    body: CalibrationInterface,
    user: UserInterface
}


const checkExpirationDate = async (req: RequestBody, res: Response) => {
    logger.verbose('[Machine, checkExpirationDate]', `User:${req.user.email} action:Send Mail with Expiration Dates`)
    // lectura de base de datos para obtener las maquinas
    const [total, machines] = await Promise.all([
        Calibration.countDocuments({ status: true }),
        Calibration.find({ status: true })
    ]);
    let body: string[] = [];

    machines.forEach(machine => {
        const expirationDate = machine.expira;
        const daysRemaining = calculateDaysRemaining(expirationDate);

         if (daysRemaining <= 7 && daysRemaining >= 0) {
             console.log(`Quedan ${daysRemaining} días antes de la expiración maquina: ${machine.id_maquina} - ${machine.nomMaquina}.`);
             body.push(`${machine.id_maquina} - ${machine.nomMaquina}: ${daysRemaining} días antes de la expiración`)
         }
    });

    const arrayAsString = body.join('\n');

    const response = await transporter.sendMail({
        from: `Leonardo Heredia omen_scorpio123@hotmail.com`,
        to: ["leonardo_heredia123@hotmail.com"],
        subject: "Test Alertas Maquinas por expirar",
        text: `${arrayAsString}`
     });

     console.log(response);
     res.status(200).json({ok: true, msg: "Mensaje enviado con exito.!"})

}

function isWeekday(date: Date) {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 es domingo, 6 es sábado
}

function calculateDaysRemaining(expirationDate: number | Date) {
    const currentDate = new Date();
    let daysRemaining = 0;

    // Iterar hacia adelante para encontrar los próximos días hábiles
    while (currentDate < expirationDate && daysRemaining <= 7) {
        currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
        if (isWeekday(currentDate)) {
            daysRemaining++;
        }
    }

    return daysRemaining;
}

// Automatic Task to send mail at 7:00am excludes sat and sun
cron.schedule('0 7 * * 1-5', async() => {
    SendMail();
})

async function SendMail() {
    logger.verbose('[Machine, cron send mail]')
    // lectura de base de datos para obtener las maquinas
    const [total, machines] = await Promise.all([
        Calibration.countDocuments({ status: true }),
        Calibration.find({ status: true })
    ]);
    let body: string[] = [];

    machines.forEach(machine => {
        const expirationDate = machine.expira;
        const daysRemaining = calculateDaysRemaining(expirationDate);

         if (daysRemaining <= 7 && daysRemaining >= 0) {
             console.log(`Quedan ${daysRemaining} días antes de la expiración maquina: ${machine.id_maquina} - ${machine.nomMaquina}.`);
             body.push(`${machine.id_maquina} - ${machine.nomMaquina}: ${daysRemaining} días antes de la expiración`)
         }
    });

    const arrayAsString = body.join('\n');

    const response = await transporter.sendMail({
        from: `Test Machines omen_scorpio123@hotmail.com`,
        to: ["leonardo_heredia123@hotmail.com"],
        subject: "Alertas Maquinas por expirar - Atención",
        text: `${arrayAsString}`
     });

     console.log(response);
}

export default checkExpirationDate;