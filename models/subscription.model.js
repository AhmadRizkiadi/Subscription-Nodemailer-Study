import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, 'Subscription name is required'],
        trim : true,
        minlength : [3, 'Subscription name must be at least 3 characters long'],
        maxlength : [50, 'Subscription name must be less than 50 characters long']
    },
    price :{
        type : Number,
        required : [true, 'Subscription price is required'],
        min : [0, 'Subscription price must be greater than 0']
    },
    currency :{
        type : String,
        enum : ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'IDR'],
        default : 'IDR'
    },
    frequency :{
        type : String,
        enum : ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category :{
        type : String,
        enum : ['entertainment', 'utilities', 'software', 'education', 'health', 'other'],
        required : [true, 'Subscription category is required']
    },
    paymentMethod :{
        type : String,
        required : [true, 'Payment method is required'],
        trim : true,
    },
    status :{
        type : String,
        enum : ['active', 'canceled', 'expired'],
        default : 'active'
    },
    startDate :{
        type : Date,
        required : [true, 'Subscription start date is required'],
        validate : {
            validator : (value) => value <= new Date(),
            message : 'Start date must be in the past or present'
    }},
    renewalDate :{
        type : Date,
        // Dihilangkan status required: true karena akan digenerate otomatis sewaktu pre-save
        validate : {
            validator : function(value) {
                return value > this.startDate;
            },
            message : 'Renewal date must be after start date',
    }},
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true,
    }
}, {
    timestamps : true
});

//auto-calculate renewal date based on frequency if not provided
subscriptionSchema.pre('save', function() {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily : 1,
            weekly : 7,
            monthly : 30,
            yearly : 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

//auto-update the status if renewal date has passed
    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;