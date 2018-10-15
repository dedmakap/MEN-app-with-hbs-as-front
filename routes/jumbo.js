var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);
const db = require('../models');
const { checkAuthReact, } = require('../middlewares/checkauth');

router.get('/', (req, res) => {
	if (!req.cookies.token) {
		return res.render('jumbo', { title: 'MyApp', css: ['jumbo.css'] });
	}
	var { token } = req.cookies;
	var email = jwt.verify(token, 'secret');
	var user;
	var isAdmin = false;
	User.findOne({ email })
		.populate('role', 'name')
		.exec(function (err, data) {
			if (err) {
				logger.error(err.message);
				return res.status(500).json({ error: true, message: err.message });
			}
			if (!data) {
				return res.render('jumbo', {
					title: 'MyApp',
					css: ['jumbo.css']
				});
			}
			user = data.firstName;
			if (data.role.name === 'admin') {
				isAdmin = true;
			}
			return res.render('jumbo', {
				id: data._id,
				user,
				isAdmin,
				title: 'MyApp',
				css: ['jumbo.css']
			});
		})
})

router.get('/api', async (req, res) => {
	const query = {
		include: [
			{ model: db.User, attributes: { exclude: 'password' } },
			{ model: db.Like, include: [{ model: db.User }] },
		],
		order: [['createdAt', 'desc']]
	}
	const posts = await db.Post.findAll(query)
	return res.json(posts).status(200);
})

router.post('/api/newpost', checkAuthReact, async (req, res) => {
  var authorID = Number(req.body.newPost.author.id);
  var content = req.body.newPost.postContent;
  var newPost = await db.Post.create({
    content,
    authorID,
	});
	const query = {
		include: [
			{ model: db.User, attributes: { exclude: 'password' } },
			{ model: db.Like, include: [{ model: db.User }] },
		],
		order: [['createdAt', 'desc']]
	}
	const posts = await db.Post.findAll(query)
	return res.json(posts).status(200);
})

router.post('/api/newlike', checkAuthReact, async (req, res) => {
	var { postID, userID } = req.body;
	postID = Number(postID);
	userID = Number(userID);
	var query = {
		where: {postID, userID},
		defaults: {postID, userID}
	}
	db.Like.findOrCreate(query)
		.spread(async (like, created) => {
			try {

				if (!created) {
					like.destroy();
				}
				var likes = await db.Like.findAll({where: {postID}});
				console.log('ya tut',likes.length);
				return res.json(likes);	
			}
			catch (err) {
				logger.error(err.message);
				return res.status(500).json({ error: true, message: err.message });
			}
		});
})

module.exports = router;