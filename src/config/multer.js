import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
    storage: multer.diskStorage({
        //onde a imagem será armazenada. Pasta tmp/uploads
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, response) => {
                if (err) {
                    return callback(err);
                }
                //Se não deu erro, se pega o nome da imagem gerando caracteres aleatorios(response)
                //com a extensão da imagem
                return callback(null, response.toString('hex') + extname(file.originalname))
            });
        }
    })
}
