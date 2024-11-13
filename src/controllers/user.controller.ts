import { Request, Response } from 'express';
import User from '../models/User';

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import bcryptConfig from '../config/bcrypt';



const userController = {
    create: async (req: Request, res: Response) => {
        try {
            const { name, email, password: passwordBody } = req.body;

            if (!name || !email || !passwordBody) return res.status(400).json({ message: "Missing data" });

            const isUserExists = await User.findOne({ email }).exec();

            if (isUserExists) return res.status(401).json({ message: "User Already Exists" })

            const password = await bcrypt.hash(passwordBody, bcryptConfig.salt);
            const access_token = crypto.randomBytes(30).toString("hex");

            const newUser = await new User({
                name,
                email,
                password,
                access_token
            }).save();

            return res.status(201).json(newUser);

        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // login: async (req: Request, res: Response) => {
    //     try {
    //         const { email, password } = req.body;

    //         if (!email || !password) return res.status(400).json({ message: "Couldn't find your email" });

    //         const user = await User.findOne({ email }).exec();

    //         if (!user) return res.status(401).json({ message: "Email or Password is Wrong!" })

    //         const isPasswordValid = await bcrypt.compare(password, user.password);

    //         if (!isPasswordValid) return res.status(401).json({ message: "Email or Password is Wrong!" })

    //         return res.status(200).json({
    //             _id: user._id,
    //             name: user.name,
    //             email: user.email,
    //             access_token: user.access_token,
    //         });

    //     } catch (err) {
    //         return res.status(500).json({ message: "Internal Server Error" })
    //     }
    // },
    checkEmail: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
    
            if (!email) {
                return res.status(400).json({ message: "Couldn't find your email" });
            }
    
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(404).json({ message: "Email not found" });
            }
    
            return res.status(200).json({ message: "Email is valid", userId: user._id });
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    
    checkPassword: async (req: Request, res: Response) => {
        try {
            const { userId, password } = req.body;
    
            if (!userId || !password) {
                return res.status(400).json({ message: "User ID and password are required" });
            }
    
            const user = await User.findById(userId).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Incorrect password" });
            }
    
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                access_token: user.access_token,
            });
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
     
    // login: async (req: Request, res: Response) => {
    //     try {
    //         const { email} = req.body;

    //         if (!email) return res.status(400).json({ message: "Couldn't find your email" });

    //         const user = await User.findOne({ email }).exec();

    //         if (!user) return res.status(401).json({ message: "Email or Password is Wrong!" })

    //         const isPasswordValid = await bcrypt.compare(password, user.password);

    //         if (!isPasswordValid) return res.status(401).json({ message: "Email or Password is Wrong!" })

    //         return res.status(200).json({
    //             _id: user._id,
    //             name: user.name,
    //             email: user.email,
    //             access_token: user.access_token,
    //         });

    //     } catch (err) {
    //         return res.status(500).json({ message: "Internal Server Error" })
    //     }
    // },

    select: async (req: Request, res: Response) => {
        try {
            const { id: _id } = req.params;
            const noSelect = [
                "-password",
                "-email",
                "-access_token",
            ];
            if (_id) {
                const user = await User.findOne({ _id }, noSelect).exec();
                return res.status(200).json(user);
            } else {
                const users = await User.find({}, noSelect).exec();
                return res.status(200).json(users);
            }
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id: _id } = req.params;
            const { name, email, password: passwordBody } = req.body;
    
            if (!_id) return res.status(400).json({ message: "Missing User ID" });
    
            const user = await User.findById(_id).exec();
            if (!user) return res.status(404).json({ message: "User Not Found" });
    
            // Update fields only if provided in the request body
            if (name) user.name = name;
            if (email) user.email = email;
            if (passwordBody) {
                user.password = await bcrypt.hash(passwordBody, bcryptConfig.salt);
            }
    
            const updatedUser = await user.save();
    
            // Exclude sensitive fields in the response
            const { password, access_token, ...responseUser } = updatedUser.toObject();
            return res.status(200).json(responseUser);
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
};

export default userController;