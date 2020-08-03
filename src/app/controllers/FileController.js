import File from '../models/File';

class FileController{

    //Incluindo a imagem do avatar do usuário no banco de dados
    async store(req, res){
        const name = req.file.originalname;
        const path = req.file.filename;

        const file = await File.create({ name: name, path: path });

        return res.json(file);
    }
}


export default new FileController();
