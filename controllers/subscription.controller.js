import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import { sendReminderEmail } from '../utils/send-email.js';

export const createSubscription = async (req, res,next ) => {
    try {
        const subscription = await Subscription.create({
            ... req.body,
            user : req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'Content-Type': 'application/json'
            },
            retries: 0,
        });

        // ================= TEMPORARY TEST =================
        // Hapus kode ini setelah pengujian berhasil!
        const populatedSubscription = await Subscription.findById(subscription.id).populate('user', 'name email');
        await sendReminderEmail({
            to: req.user.email,
            type: 'reminder_7 days_before',
            subscription: populatedSubscription
        });
        console.log("TEST EMAIL SENT BYPASSING UPSTASH!");
        // ==================================================

        res.status(201).json({
            success : true,
            data : subscription, workflowRunId
        });

    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {   
        if(req.user._id.toString() !== req.params.id) {
            const error = new Error('You are not the owner of this subscription');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user : req.params.id });

        res.status(200).json({
            success : true,
            data : subscriptions
        });

    } catch (error) {
        next(error);
    }
}
