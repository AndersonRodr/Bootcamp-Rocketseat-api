import jwt from 'jsonwebtoken';
import User from '../models/User';
import auth from '../../config/auth';
import * as Yup from 'yup'

class SessionController {
    async store(req, res){

        //Validação de campos inválidos no login
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        //Verificação de campos inválidos na hora do login
        if (! (await schema.isValid(req.body))){
            return res.status(400).json({ erro: 'Campos Inválidos.' });
        }

        const email = req.body.email;
        const pass = req.body.password;
        const user = await User.findOne( { where: { email } } );

        if (!user){
            return res.status(404).json( { error: 'Usuário não encontrado.' });
        }

        //Verificando se a senha digitada no login condiz com a que está no banco
        if (!(await user.verifyPass(pass))){
            return res.status(404).json( { error: 'Usuário ou senha inválidos.' } )
        }

        const id = user.id;
        const name = user.name;

        //O token é necessário para que o usuário possa estar acessando a aplicação
        return res.json(
            {
                user: {
                    id,
                    name,
                    email,
                  },
                  token: jwt.sign( { id } , auth.hash, { expiresIn: auth.expiresIn })
            } );
    }
}

//string token: gostackrocketseat

export default new SessionController();
