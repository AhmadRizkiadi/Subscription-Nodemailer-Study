import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => { 
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        // Typically, users are created via the Auth flow (Register).
        // If you need manual creation here, ensure you hash passwords correctly.
        const newUser = await User.create(req.body);
        
        // Don't send password back in response
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            data: userObj
        });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        // Make sure user can only update their own account unless admin
        if(req.user._id.toString() !== req.params.id) {
            const error = new Error('You are not authorized to update this user');
            error.statusCode = 403;
            throw error;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Make sure user can only delete their own account unless admin
        if(req.user._id.toString() !== req.params.id) {
            const error = new Error('You are not authorized to delete this user');
            error.statusCode = 403;
            throw error;
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
}
