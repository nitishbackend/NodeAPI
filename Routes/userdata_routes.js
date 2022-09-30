const express = require('express');
const router = express.Router();
const RegisterModel = require('../models/register');



//Register Post Method
router.post('/register', async (req, res) => {
	let { email, password,firstName,lastName,mobileNo,userType,languageCode } = req.body;
	if (password == '') {
		res.status(200).json({ message: "Password is blank" })
		return

	} else if (email == '') {
		res.status(200).json({ message: "Email is blank" })
		return
	} else {

		try {
			var query = { email: email }
			//console.log(req.body.email);
			const dataFound = await RegisterModel.find(query)
			//console.log(dataFound);
			if (dataFound != null && dataFound != "") {
				return res.json({ message: req.body.email + " already exists, please login to continue" })
			} else {
				encryptedPassword = await bcrypt.hash(req.body.password, 10); //Encrypt user password
				//console.log("Encrypted Password:  "+encryptedPassword);
				const data = new RegisterModel({
					email: email,
					password: encryptedPassword,
					firstName: firstName,
					lastName: lastName,
					mobileNo: mobileNo,
					userType: userType,
					registrationDate: new Date(),
					userType: userType,
					languageCode: languageCode
				})
				const dataToSave = await data.save();
				return res.status(200).json({ message: "Created sucessfully", dataToSave })
			}

			//res.status(status,{message: "Password is blank"}).json(dataToSave)

		}
		catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

})


module.exports = router;