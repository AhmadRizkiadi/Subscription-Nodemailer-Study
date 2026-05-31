import { Router } from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Protect all routes with authorize middleware
userRouter.use(authorize);

// GET /users -> list of users
userRouter.get('/', getUsers);

// GET /users/:id -> get user by id 
userRouter.get('/:id', getUserById);

// POST /users -> Create new user
userRouter.post('/', createUser);

// PUT /users/:id -> Update user details
userRouter.put('/:id', updateUser);

// DELETE /users/:id -> Delete user
userRouter.delete('/:id', deleteUser);

export default userRouter;