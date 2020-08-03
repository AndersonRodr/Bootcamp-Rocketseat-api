import { resolve } from 'path';
import nodeMail from '../config/mail';
import nodemailer from 'nodemailer';
import exphds from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail{
    constructor(){
        const { host, port, secure, auth } = nodeMail;
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });

        this.configureTemplates();
    }

    configureTemplates(){
        const viewPath = resolve(__dirname,'..', 'app', 'views', 'emails');

        this.transporter.use('compile', nodemailerhbs({
            viewEngine: exphds.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayouts: 'default',
                extName: '.hbs'
            }),
            viewPath,
            extName: '.hbs',
        }));
    }

    sendMail(message){
        return this.transporter.sendMail(
            { ... nodeMail.default, ... message }
        );
    }
}

export default new Mail();
