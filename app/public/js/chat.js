var io = io();
const isName = localStorage.getItem('username');
const chatSend = $('.chat-message-send');
const msgInput = $('.chat-message-control');
const msgTypingIndicator = $('.user-type-msg');
const chatBody = $('#chat-body');
// Get chat History
$.getJSON('/api/chats').done(function (data) {
	$('#loader').hide();
	data.forEach(function (element) {
		$('#chat-messages').append(
			'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"><i class="fa fa-user"></i></div><span class="person-name">' + element.name + '</span></div><div class="message-body"><p>' + element.message + '</p><div class="message-date">' + moment(element.date).format('h:mm:ss a, Do MMMM YYYY') + '</div></div></div></li>');
	}, this);
	chatBody.scrollTop(chatBody.prop('scrollHeight') - chatBody.innerHeight());

	$('#online-users').css('top', chatBody.prop('scrollHeight') - chatBody.innerHeight());
});



function initChat() {

	io.on('get:users', function (users) {
		let storedUser = localStorage.getItem('username');
		let userList = [...new Set(users)].map(function (user) {
			return storedUser === user ? '' : '<li><span></span>' + user + '</li>'
		});
		console.log(storedUser, userList);
		$('#onusers-list').html((storedUser ? '<li><span></span> you ~ ' + storedUser + '</li>' : '') + userList.join(''));

	});
	io.on('users:online', users => {
		console.log('online users', users);
		if (users.length > 0) {
			let username = localStorage.getItem('username');
			let userList = users.map(function (user) {
				return username === user ? '' : '<li><span></span>' + user + '</li>'
			});

			$('#onusers-list').html((username ? '<li><span></span> you ~ ' + username + '</li>' : '') + userList.join(''));
		}
	});

	io.on('someoneConnected', function () {
		console.log(localStorage.getItem('username') + " connected")
	});

	io.on('chat:typying', function (user, inputVal) {
		if (inputVal.length > 1 && inputVal.trim()) {
			$('.user-type-msg').css('bottom', -chatBody.prop('scrollHeight') + chatBody.innerHeight());
			msgTypingIndicator.css('opacity', 1);
			msgTypingIndicator.find('span').text(user);
		} else {
			msgTypingIndicator.css('opacity', 0);
		}
	});



	$('.chat-message-send:disabled').css({
		'background-color': '#ccc',
		'cursor': 'not-allowed'
	});

}

initChat();

io.on('chat-message', function (data) {
	console.log(data);
	$('#chat-messages').append(
		'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"><i class="fa fa-user"></i></div><span class="person-name">' + data.name + '</span></div><div class="message-body"><p>' + data.message + '</p><div class="message-date">' + moment(data.date).format('h:mm:ss a, Do MMMM YYYY') + '</div></div></div></li>');
	msgTypingIndicator.css('opacity', 0);
	chatBody.scrollTop(chatBody.prop('scrollHeight') - chatBody.innerHeight());
});
// listen on input event
msgInput.on('keydown', (event) => {
	let inputVal = msgInput.val();
	if (inputVal && inputVal.trim()) {
		io.emit('user:typing', localStorage.getItem('username'), inputVal);
	}
});



function initName() {
	chatSend.attr('disabled', false);
	$('.chat-message-name').val(isName);
	$('.name-checker-found').text(localStorage.getItem('username'));
	$('.name-checker').hide();
	$('#name-checked').show();
}
$('.leave-chat').on('click', ev => {
	let username = localStorage.getItem('username');
	$('#chat-bot').fadeOut();
	localStorage.removeItem('username');
	chatSend.attr('disabled', true);
	$('.name-checker').show();
	$('#name-checked').hide();
	io.emit('disconnect', username);
})
$('.chat-message-name').on('keydown', function (e) {
	if (e.keyCode == 13 && $('.chat-message-name').val()) {
		e.preventDefault();
		localStorage.setItem('username', $(this).val());
		initName();
		initChat();
		io.emit('user:in', localStorage.getItem('username'));
		chatSend.removeAttr('disabled');
		$('#chat-bot').fadeIn();
	}
});

if (isName) {
	$('#chat-bot').fadeIn();
	initName();
	io.emit('user:in', localStorage.getItem('username'));
	initChat();
} else {
	chatSend.attr('disabled', true);
	$('#name-checked').fadeOut(0);

	$('#chat-bot').fadeOut(0);
}

//localStorage.removeItem('name');

function sendclick(e) {

	let chatMsg = msgInput.val();
	if (chatMsg && isName) {
		e.preventDefault();
		//console.log(chatMsg);
		msgTypingIndicator.css('opacity', 0);
		$('#chat-messages').append(
			'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"><i class="fa fa-user"></i></div><span class="person-name">' + isName + '</span></div><div class="message-body"><p>' + chatMsg + '</p><div class="message-date">' + new Date(Date.now()).toLocaleString().slice(11, 19) + '</div></div></div></li>');
		chatBody.scrollTop($(this).scrollMaxY);
		console.log(chatBody.scrollTop());
		msgInput.val('');
		$.post('/api/chats', {
			name: localStorage.getItem('username'),
			message: chatMsg
		}).done(function (data) {
			io.emit("send", data);
		});

	} else {
		msgInput.focus();
	}
	//console.log(e);


}

$('.chat-message-send').on('click', function (e) {
	let userName = localStorage.getItem('username');
	let chatMsg = msgInput.val();
	if (chatMsg && userName) {
		e.preventDefault();
		//console.log(chatMsg);

		$('#chat-messages').append(
			'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"><i class="fa fa-user"></i></div><span class="person-name">' + userName + '</span></div><div class="message-body"><p>' + chatMsg + '</p><div class="message-date">' + moment().format('h:mm:ss a, Do MMMM YYYY') + '</div></div></div></li>');
		chatBody.scrollTop($(this).scrollMaxY);
		console.log(chatBody.scrollTop());
		msgInput.val('');
		$.post('/api/chats', {
			name: isName,
			message: chatMsg
		}).done(function (data) {
			io.emit("send", data);
		});

	} else {
		msgInput.focus();
	}
	//console.log(e);
	let scrollVal = chatBody.prop('scrollHeight') - chatBody.innerHeight();
	chatBody.scrollTop(scrollVal);

	$('#online-users').css('top', scrollVal)
})




/*$('.chat-message-send').on({
	'click':sendclick,
	'keydown': function(ev){
		if (ev.keyCode == 13) 
			sendclick(ev)
	}
});*/