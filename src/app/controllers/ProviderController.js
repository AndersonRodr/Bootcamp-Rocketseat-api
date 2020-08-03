import User from '../models/User';
import File from '../models/File';

class ProviderController{

    async index(req, res){
        const providersList = await User.findAll( {
            where: { provider: true },
            attributes: ['id', 'name', 'email'],
            include: {
                model: File,
                attributes: ['id', 'name', 'path', 'url'],
                as: 'avatar'
            }
        } );

        if (providersList.length == 0){
            return res.status(404).json({ erro: 'Nenhum prestador de serviço encontrado.' });
        }
        return res.status(200).json(providersList);
    }
}

export default new ProviderController;
