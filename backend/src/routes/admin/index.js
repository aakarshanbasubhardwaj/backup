import { Router } from "express";
import User from '../../../db/models/userModel.js'

const router = Router();

function isAdmin(req, res, next){
    if (req.user?.isAdmin)
        next();
    else return res.status(403)
}

router.get('/getUsers', isAdmin, async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({users});
});

router.post('/activateUser', isAdmin, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const user = await User.findOne({ googleId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        return res.status(200).json({ message: 'User activated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Problem Activating User: ${err.message}` });
    }
});

router.post('/deactivateUser', isAdmin, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const user = await User.findOne({ googleId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(400).json({ error: 'User already inactive' });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({ message: 'User deactivated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Problem Deactivating User: ${err.message}` });
    }
});

router.post('/makeAdmin', isAdmin, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const user = await User.findOne({ googleId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'User must be active in order to be made an admin' });
        }

        user.isAdmin = true;
        await user.save();

        return res.status(200).json({ message: 'User is now an admin' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Problem adding admin: ${err.message}` });
    }
});

router.post('/removeAdmin', isAdmin, async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const user = await User.findOne({ googleId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isAdmin) {
            return res.status(400).json({ error: 'User is already not an admin' });
        }

        user.isAdmin = false;
        await user.save();

        return res.status(200).json({ message: 'User is no longer an admin' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Problem removing admin: ${err.message}` });
    }
});

export default router;