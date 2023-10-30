const model = require('../model/NomineesSchema')
const transporter = require('../middleware/transpoter')

const selected = async (req, res) => {
    const nominees = req.body
    // console.log(nominees.userID)
    // console.log(nominees)

    try {
        // Send the OTP via email using Nodemailer
        const mailOptions = {
            from: 'chideraekwuno@gmail.com',
            to: nominees.email,
            subject: 'OTP for signup',
            text: `Your nominees are as follows`,
            html: `<h1>Your nominee ID is ${nominees.userID}<h1/>`
        };

        await transporter.sendMail(mailOptions);

        await model.create(nominees)
        res.status(200).json({ disable: false });

    } catch (error) {
        console.error('Error sending OTP via email:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
    }

}

const leaderboard = async (req, res) => {

    const collection = await model.find({})

    const fieldsToRetrieve = {
        Coordinator: [],
        'Deputy coordinator & Director and patnership': [],
        Secretary: [],
        'Assistant Secretary': [],
        'Programmes Officer': [],
        'Financial Secretary': [],
        Treasurer: [],
        "Communications and Social Media Manager": []
    };

    collection.forEach((document) => {
        for (const fieldName in fieldsToRetrieve) {
            const value = document[fieldName];
            if (value) {
                fieldsToRetrieve[fieldName].push(value);
            }
        }
    });

    const colation = []
    for (key in fieldsToRetrieve) {
        const value = fieldsToRetrieve[key]
        const countMap = countOccurrences(value);

        function countOccurrences(arr) {
            return arr.reduce((countMap, element) => {
                countMap[element] = (countMap[element] || 0) + 1;
                return countMap;
            }, {});
        }
        // const uniqueElements = Object.keys(countMap);
        colation.push({ [key]: countMap })
    }
    // console.log(colation)
    res.status(200).json(colation)
}

// console.log('Names from Fields:', fieldsToRetrieve);

module.exports = { selected, leaderboard }