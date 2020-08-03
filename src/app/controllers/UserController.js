import User from '../models/User';
import * as Yup from 'yup';

import bcrypt from 'bcryptjs';

class UserController{
    async store(req, res){

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (! (await schema.isValid(req.body))){
            return res.status(400).json({ erro: 'Campos inválidos.' });
        }


        const userExist = await User.findOne( { where: { email: req.body.email } });

        if (userExist){
            return res.status(400).json({ erro: 'Email já cadastrado.' })
        }
        else{
            const user = await User.create(req.body)
            return res.json(user);
        }
    }

    async index(req, res){
        const user = await User.findOne( { where: { email: req.body.email, password_hash: req.body.pass } });
        if (user){
            return res.json(user);
        }
        else{
            return res.status(404).json( {error: 'Usuário não encontrado.'} )
        }
    }

    async update(req, res){
        const email = req.body.email;
        const oldPass = req.body.oldPassword;

        const user = await User.findByPk(req.userId);

        if (email != user.email){
            const emailExist = await User.findOne( { where: { email:  email} });
            if (emailExist){
                return res.status(400).json( { erro: 'Email já cadastrado.' } );
            }
        }


        if (oldPass && !(await user.verifyPass(oldPass))){
            return res.status(401).json( { erro: 'Senha incorreta.' } );
        }

        const user2 = await user.update(req.body);

        return res.json(user2);
    }

}

export default new UserController();
