import nc from 'next-connect'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import User from '../../../models/user'
import dbConnect from '../../../utils/dbConnect'
import { generateToken } from '../../../utils/helpers'

const handler = nc().use( async(req,res,next)=>{
   const connection =  await dbConnect()
   req.databaseConnection = connection
    next()
   }).post(async (req,res)=>{
    try{
        const {databaseConnection} = req

        const checkUser = await User.findOne({email:req.body.email});
        if(checkUser){
            res.status(400).json({message:'User already exist'})
        }else{
           const password =  await bcrypt.hash(req.body.password,8)
            const user = new User({
                name:req.body.name,
                password,
                email:req.body.email
            })
            const saveUser = await user.save()
            const token = await generateToken(saveUser._doc._id)
            res.status(201).json({message:'User created successfully',data:{
                ...saveUser._doc,
                token,
                }})
        }
    }catch(e){
        res.status(400).send({message:e.message})
    }

}).get((req,res)=>{
    res.status(201).json({message:'User created'})
})


export default handler