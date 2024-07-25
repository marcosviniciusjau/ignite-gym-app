const knex = require("../database") 
const DiskStorage = require("../providers/DiskStorage") 

class UserphotoController {
  async update(request, response) {
    const user_id = request.user.id 
    const photoFilename = request.file.filename 

    const diskStorage = new DiskStorage() 

    const user = await knex("users").where({ id: user_id }).first() 

    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o photo", 401) 
    }

    if (user.photo) {
      await diskStorage.deleteFile(user.photo) 
    }

    const filename = await diskStorage.saveFile(photoFilename) 
    user.photo = filename 

    await knex("users").where({ id: user_id }).update(user) 

    return response.json(user) 
  }
}

module.exports = UserphotoController 