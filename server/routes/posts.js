
import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/posts.js';

dotenv.config();

const router = express.Router();
cloudinary.config({
    cloud_name: 'Your_cloud_name',
    api_key: 'Your_cloud_api_key',
    api_secret: 'Your_cloud_secret_key',
});
//get post
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.route('/').post(async (req, res) => {
    console.log(req.body.name);
    try {
        const { name, prompt, photo } = req.body;

        // Ensure that you use the correct parameter name "file" for the image
        const photoUrl = await cloudinary.uploader.upload(req.body.photo, { folder: 'your-folder-name' });

        const newPost = await Post.create({
            name: req.body.name,
            prompt: req.body.prompt,
            photo: photoUrl.url,
        });

        res.status(200).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
