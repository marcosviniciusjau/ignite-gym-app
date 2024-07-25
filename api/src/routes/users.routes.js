const { Router } = require("express") 
const multer = require("multer") 

const uploadConfig = require("../configs/upload") 
const ensureAuthenticated = require("../middlewares/ensureAuthenticated") 

const UsersController = require("../controllers/UsersController") 
const UserPhotoController = require("../controllers/UserPhotoController") 

const usersRoutes = Router() 

const usersController = new UsersController() 
const userPhotoController = new UserPhotoController() 

const upload = multer(uploadConfig.MULTER) 

usersRoutes.post("/", usersController.create) 
usersRoutes.put("/", ensureAuthenticated, usersController.update) 
usersRoutes.patch("/photo", ensureAuthenticated, upload.single("photo"), userPhotoController.update) 

module.exports = usersRoutes 