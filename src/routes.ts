import { Router } from 'express';

// Models
import userController from './controllers/user.controller';

const routes = Router();


// Users
routes.get("/users", userController.select);
routes.get("/users/:id", userController.select);
routes.post("/users", userController.create);
routes.patch("/users/:id", userController.update);

// Login Routes
//routes.post("/session", userController.login);
routes.post("/session/email", userController.checkEmail);
routes.post("/session/password", userController.checkPassword);


export default routes;