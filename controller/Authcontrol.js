const create = require('../model/Authschema')
const verify = require('../model/tempAuthSchema')
const nominee = require('../model/NomineesSchema')
const illegible = require('../model/record')
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt')
const transporter = require('../middleware/transpoter')

const createUser = async (req, res) => {
    const { email, password } = req.body

    const exist = await create.findOne({ email })

    if (!exist) {
        return res.status(400).json({ error: 'invalid email or password' })
    }

    const match = await bcrypt.compare(password, exist.password)
    const check = await verify.findOne({email})
    if(check){
        await verify.deleteOne({email : email})
    }


    if (!match) {
        throw Error('incorrect emial or password')
    }

    res.status(200).json(exist._id)
    // console.log(email, password)

}

const validnomination = async (req,res) => {
    const {userID} = req.body

    const check = await nominee.findOne({userID})

    if(check){
        return res.status(200).json({disable: false})
    }
}

const illegibleUser = async (req, res) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false })
    const { email, password } = req.body
    const exist = await illegible.findOne({ email })

    if (!exist) {
        return res.status(400).json({ error: 'Not illegible to vote' })
    }

    const user = await verify.findOne({ email })


    if (user) {
        return res.status(400).json({ error: 'user exist already' })
    }


    if (exist) {
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        try {
            // Send the OTP via email using Nodemailer
            const mailOptions = {
                from: 'chideraekwuno@gmail.com',
                to: email,
                subject: 'OTP for signup',
                text: `Your otp ${otp}`,
                html: `<h1>Your otp ${otp}`
            };

            await transporter.sendMail(mailOptions);

            await verify.create({ email, password: hash, otp });
            res.status(200).json({ message: 'OTP sent successfully' });
            
        } catch (error) {
            console.error('Error sending OTP via email:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
    }



}

const registerUser = async(req,res) => {
    const {email,password,otp} = req.body

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    const user = await verify.findOne({email})

    if(user.otp === otp){
        const exist = await create.findOne({email})
        if(exist){
            // res.status(200).json('account created successfully')
            // res.status(400).json('Authentication failed')
            res.status(400).json('Authentication failed')
        }
        if(!exist){
            const register = await create.create({email:email,password:hash})
            res.status(200).json(register._id)
        }
        // res.status(200).json('Authentication succesfull')
    }

    if(user.otp !== otp){
        res.status(400).json('Otp Authenticaton failed')
    }

}
module.exports = { createUser, illegibleUser, registerUser,validnomination }