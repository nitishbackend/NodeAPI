const express = require('express');
const router = express.Router();
const RegisterModel = require('../models/register');
const TempOtpHolder = require('../models/temp_otp_holder');
const ProfileDetails = require('../models/profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('dotenv').config()
const auth = require("../middleware/auth");
const transporter = require("../middleware/nodemailer")
const otpGenerator = require('otp-generator');
const secure_configuration = process.env;

//Post Method
//router.post('/post', (req, res) => {
//    res.send('Post API')
//})

//Register Post Method
router.post('/register', async (req, res) => {
	let { email, password, firstName, lastName, mobileNo, userType, languageCode } = req.body;
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
					languageCode: languageCode,
					profilePicture: secure_configuration.PROFILE_PICTURE
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

//Login Post Method
router.post('/login', async (req, res) => {
	let { password, email } = req.body;

	if (password == '') {
		return res.status(200).json({ message: "Password is blank" })
	}

	if (email == '') {
		return res.status(200).json({ message: "Email is blank" })
	}

	try {
		var query = { email: email };
		const dataFound = await RegisterModel.findOne({ ...query });
		if (dataFound) {
			//console.log("dataFound  ");
			let hashPass = dataFound.password;
			//console.log("dataFound  ");
			//console.log("Hash Password: "+hashPass);
			//onsole.log("User Password: "+password);
			let valid = await bcrypt.compare(password, hashPass);
			if (valid) {
				return res.json({ message: "Logged in sucessfully", token: generateToken(dataFound._id, dataFound.userType, dataFound.email) });
				//console.log("Token:  " + token);
			} else {
				return res.json({ message: "Invalid credentials" });
			}

		} else {
			return res.json({ message: "Email not registred with us." });
		}

		//res.status(status,{message: "Password is blank"}).json(dataToSave)

	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}


})

//Send Otp
router.post('/sendOtpViaMail', async (req, res) => {
	let { email, otpType } = req.body;

	if (email == '') {
		return res.status(200).json({ message: "Email is blank" })
	}

	try {
		var query = { email: email };
		const dataFound = await RegisterModel.findOne({ ...query });
		if (dataFound) {
			sendOtpViaMail(email, otpType)
			return res.json({ message: "OTP Sent To " + email });

		} else {
			return res.json({ message: "Email not registred with us." });
		}

		//res.status(status,{message: "Password is blank"}).json(dataToSave)

	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}


})

//Verify Otp
router.post('/verifyOtp', async (req, res) => {
	let { email, otp } = req.body;

	if (otp == '') {
		return res.status(200).json({ message: "Invalid OTP" })
	}

	try {
		var queryLoginOtp = { email: email };
		const dataOtp = await TempOtpHolder.findOne({ ...queryLoginOtp });
		if (dataOtp != null) {
			if (dataOtp.otp == otp) {
				var query = { email: email };
				const dataFound = await RegisterModel.findOne({ ...query });
				console.log(dataFound)
				if (dataFound) {
					await TempOtpHolder.findByIdAndDelete({ _id: dataOtp._id }) //delete whole row data
					if (dataOtp.otpType == "resetPassword") {
						return res.json({ message: "OTP verified sucessfully, Please login to continue" });
					} else {
						return res.json({ message: "OTP verified sucessfully", token: generateToken(dataFound._id, dataFound.userType, dataFound.email) });
					}
				}

			} else {
				return res.json({ message: "Provide valid OTP sent to your email" + email });
			}
		} else {
			return res.json({ message: "OTP Expired, Please re-intiate process!" });
		}

		//res.status(status,{message: "Password is blank"}).json(dataToSave)

	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}


})

//Reset Password
router.post('/resetPassword', async (req, res) => {
	let { email, newPassword } = req.body;

	if (email == '') {
		return res.status(200).json({ message: "Invalid Email-Id" })
	}

	try {
		var query = { email: email };
		const dataFound = await RegisterModel.findOne({ ...query });
		console.log(dataFound)
		if (dataFound) {
			encryptedPassword = await bcrypt.hash(newPassword, 10); //Encrypt user password
			console.log(dataFound._id);
			await RegisterModel.findByIdAndUpdate(dataFound._id, { password: encryptedPassword }, { new: true })
			return res.json({ message: "Password Reset Done, Please login with new password to continue!" });
		} else {
			return res.status(200).json({ message: "User not found, please register to continue!" })
		}

		//res.status(status,{message: "Password is blank"}).json(dataToSave)

	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}


})

//Get all Method
router.get('/getAll', async (req, res) => {
	try {
		const data = await RegisterModel.find();
		if (data.length > 0) {
			return res.json({ message: data.length + " User found", data })
		} else {
			return res.json({ message: "No user found" })
		}
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

//Get by ID Method
//router.get('/getOne/:id', (req, res) => {
//   res.send('Get by ID API')
//})

// router.get('/getOne', async (req, res) => {
//     try{
//         const data = await RegisterModel.findById(req.body.id);
// 		if(data==null){
// 			return res.status(200).json({message:"User not found"});
// 		}else{
// 			return res.status(200).json({message:"User found",data});
// 		}

//     }
//     catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

router.get('/getOne', auth, async (req, res) => {

	try {
		let { id, userType } = req.body
		var query = { _id: id, userType: userType }
		console.log(req.headers['authorization']);

		var token = req.headers['authorization'];
		var decodededToken = jwt.decode(token, { complete: true });
		console.log(decodededToken);
		if (decodededToken.hasOwnProperty('payload')) {
			console.log(decodededToken.payload.userId);
		}

		const data = await RegisterModel.findOne(query)
		//const data = await RegisterModel.find(query,{_id:1,userType:1})

		if (!data) {
			return res.status(200).json({ message: "User not found" });
		} else {
			return res.status(200).json({ message: "User found", data });
		}

	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.get('/getProfileDetails', auth, async (req, res) => {

	try {
		console.log(req.headers['authorization']);

		var token = req.headers['authorization'];
		var decodededToken = jwt.decode(token, { complete: true });
		console.log(decodededToken);
		if (decodededToken.hasOwnProperty('payload')) {
			var tokenUserId = decodededToken.payload.userId;
			var tokenEmail = decodededToken.payload.email;
			console.log(tokenUserId);

			var query = { _id: tokenUserId, email: tokenEmail }
			const data = await RegisterModel.findOne(query)
			if (!data) {
				return res.status(200).json({ message: "User not found" });
			} else {
				let profileData = {
					userId: data._id,
					email: data.email,
					firstName: data.firstName,
					lastName: data.lastName,
					mobileNo: data.mobileNo,
					userType: data.userType,
					languageCode: data.languageCode,
					profilePicture: data.profilePicture

				}

				// delete profileData._id;

				// console.log("profileData >> ", profileData);

				return res.status(200).json({ message: "User found", profileData });
			}
		}
		//const data = await RegisterModel.find(query,{_id:1,userType:1})
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
	res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
	res.send('Delete by ID API')
})

function generateToken(userId, userType, email) {
	const token = jwt.sign(
		{ userId: userId, userType: userType, email: email },
		process.env.JWT_SECRET,
		{
			expiresIn: "2h",
		}
	);
	return token;
}

function sendOtpViaMail(emailId, otpType) {
	var generatedOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
	console.log(generatedOtp);
	const mailConfigurations = {
		from: 'nitishbackend@gmail.com',
		to: emailId,
		subject: 'OTP',
		html: '<div style=font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Testing Name</a></div><p style="font-size:1.1em">Hi,</p><p>Thank you for showing interest in us. Use the following OTP to complete your Sign in process. OTP is valid for 5 minutes</p><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">' + generatedOtp + '</h2><p style="font-size:0.9em;">Regards,<br /> Testing Name</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"><p>XYZ Pvt Ltd</p><p>Sec 99, Noida, 201301</p><p>UttarPradesh</p></div></div></div>'
		//text:"OTP to login is "+generatedOtp

	};

	transporter.sendMail(mailConfigurations, function (error, info) {
		if (error) throw Error(error);
		console.log('Email Sent Successfully');
		console.log(info);
	});
	const data = new TempOtpHolder({
		email: emailId,
		otp: generatedOtp,
		otpType: otpType,
	})
	const dataToSave = data.save();
}

module.exports = router;