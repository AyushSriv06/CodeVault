const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generator = require("generate-password");
const { googleLogin } = require("../controller/authController");

dotenv.config();

router.get("/redirect", async (req, res) => {
	const code = req.query.code;
	const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
	const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
	
	const googleTokenUrl = "https://oauth2.googleapis.com/token";
	const values = {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: `${backendUrl}/googleauth/redirect`,
		grant_type: "authorization_code",
	};

	try {
		const response = await axios.post(googleTokenUrl, qs.stringify(values), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const { id_token } = response.data;
		const googleUser = jwt.decode(id_token);
		
		if (!googleUser) {
			return res.redirect(`${frontendUrl}/login?error=InvalidToken`);
		}

		const { email, name } = googleUser;
		
		// Use the controller to handle user logic and generate our JWT
		await googleLogin(email, name, res);
		
	} catch (error) {
		console.error("Error during Google OAuth redirect:", error.message);
		res.redirect(`${frontendUrl}/login?error=OAuthFailed`);
	}
});

router.get("/auth", (req, res) => {
	const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
	const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
	
	const options = {
		redirect_uri: `${backendUrl}/googleauth/redirect`,
		client_id: process.env.GOOGLE_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};

	const params = new URLSearchParams(options);
	res.json({ finalURL: `${rootURL}?${params.toString()}` });
});

module.exports = router;
