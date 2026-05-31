import {createRequire} from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7,5,2,1]

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload || {};
    
    if (!subscriptionId) return;

    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date is passed for subscription ${subscriptionId}. Stopping Worklflow.`);
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `reminder_${daysBefore} days_before`, reminderDate);
        }
        
        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `reminder_${daysBefore} days_before`, subscription);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('getSubcription', async () =>{
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
    
}

const sleepUntilReminder = async(context, label,date) =>{
    console.log(`Sleeping until ${label} reminder for subscription ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async(context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder for subscription`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription: subscription,
        });
    })
}