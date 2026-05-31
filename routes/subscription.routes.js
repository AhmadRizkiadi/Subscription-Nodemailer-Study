import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription , getUserSubscriptions} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title : 'GET all subscriptions' }));
subscriptionRouter.get('/:id', (req, res) => res.send({ title : 'GET subscription details' }));
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, (req, res) => res.send({ title : 'Update subscription details' }));
subscriptionRouter.delete('/:id', authorize, (req, res) => res.send({ title : 'Delete subscription' }));
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', authorize, (req, res) => res.send({ title : 'Cancel subscription' }));
subscriptionRouter.get('/upcoming-renewals', authorize, (req, res) => res.send({ title : 'GET all upcoming renewals' }));

export default subscriptionRouter;