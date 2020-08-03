import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { promisify } from 'util';

export default  async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({ erro: 'Token inválido.' })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await promisify(jwt.verify)(token, authConfig.hash);

        req.userId = decoded.id;

        return next();

    } catch{
        return res.status(401).json( {erro: 'Token inválido'} );
    }

    console.log(token);

    return next();
};
