import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "omen_scorpio123@hotmail.com",
        pass: "pa$$s3cr3t0"
    }
});

export default transporter;