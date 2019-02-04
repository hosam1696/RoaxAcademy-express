let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let feedbacks = require('../../controller/mongo-schema').feedbacksSchema;
let chats = require('../../controller/mongo-schema').chatSchema;
let mainMailer = require('../../mailer');

express().use(bodyParser.json());
router
	.get('/chats', (req, res) => {
		chats.find({}, (err, data) => {
			res.json(data);
		});
	})
	.post('/chats', (req, res) => {

		let newChatMsg = new chats(req.body);

		newChatMsg.save((err, data) => {
			res.json(data);
		});
	})
	.delete('/chats/:id', (req, res) => {
		chats.findByIdAndRemove(req.params.id, (err, data) => {
			res.send('one item deleted <br>' + data);
		})


	});


router.get('/feedbacks', (req, res) => {
		feedbacks.find({}, {
			name: 1,
			message: 1,
			date: 1
		}, (err, data) => {
			if (err) throw new Error(err);
			res.json(data);
		});
	})
	.post('/feedbacks', (req, res) => {
		console.log(new feedbacks(req.body));
		if (req.body.name && req.body.message) {
			new feedbacks(req.body).save(function (err, data) {
				//fs.write('app/data/feedback.json', data.toJSON());
				console.log(JSON.stringify(data));
				res.json(data);
			});
		}

	});

router.delete('/feedbacks/:id', (req, res) => {
	feedbacks.findByIdAndRemove(req.params.id, (err, data) => {
		res.json(data);

	});
});


router.post('/sendemail', (req, res) => {
	console.log(req.body);
	const requestBody = req.body;
	const output = `
	<p>New Request ✔</p>
	<h4>Request Details</h4>
	<ul>
		<li>Name: ${requestBody.name}</li>	
		<li>Mobile: ${requestBody.mobile}</li>
		<li>Kind: ${requestBody.kind}</li>
		<li>Day: ${requestBody.day}</li>
		<li>Date: ${requestBody.date}</li>
		<li>Year: ${requestBody.year}</li>
		<li>Subject: ${requestBody.subject}</li>
		<li>Country: ${requestBody.country}</li>
		<li>City: ${requestBody.city}</li>
		<li>District: ${requestBody.district}</li>
	</ul>

	Request From
	${requestBody.name} <${requestBody.email}>
`;
	if (requestBody.name && requestBody.mobile && requestBody.kind) {

		mainMailer(output).then((r)=>{
			res.json({
				status: true,
				message: 'Email Sent',
				extra: r
			});
		})
		
	} else {
		res.json({
			status: false,
			message: 'Fill All Data'
		})
	}
})
module.exports = router;