

	var io = io();
	var isName = localStorage.getItem('username');
	var chatSend = $('.chat-message-send');

	// Get chat History
	$.getJSON('/api/chats').done(function (data) {
		$('#loader').hide();
		data.forEach(function (element) {
			$('#chat-messages').append(
				'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">' + element.name + '</span></div><div class="message-body"><p>' + element.message + '</p><div class="message-date">' + element.date.toLocaleString().slice(11, 19) + '</div></div></div></li>');
		}, this);
		$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
	});

	io.on('users:online', users => {
		console.log('online users', users);
		if (users.length >0 ) {
			var username = localStorage.getItem('username');	
			var userList = users.map(function(user){
				return username === user?'':'<li><span></span>'+user+'</li>' 
			});
			
			$('#onusers-list').html(userList);
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
		var username = localStorage.getItem('username');
		localStorage.removeItem('username');
		chatSend.attr('disabled', true);
		$('.name-checker').show();
		$('#name-checked').hide();
		io.emit('disconnect', username);
	})
	$('.chat-message-name').on('keydown', function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			localStorage.setItem('username', $(this).val());
			initName();
			io.emit('user:in', localStorage.getItem('username'));
		}
	});

	if (isName) {
		initName();
		io.emit('user:in', localStorage.getItem('username'));
	} else {
		chatSend.attr('disabled', true);
		$('#name-checked').fadeOut(0);
	}

	io.on('someoneConnected', function () {
		console.log(localStorage.getItem('username') + " connected")
	});

	io.on('chat-message', function (data) {
		console.log(data);

		$('#chat-messages').append(
			'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">' + data.name + '</span></div><div class="message-body"><p>' + data.message + '</p><div class="message-date">1/2/1976</div></div></div></li>');

		$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
	});

	$('.chat-message-send:disabled').css({
		'background-color': '#ccc',
		'cursor': 'not-allowed'
	});

	//localStorage.removeItem('name');

	function sendclick(e) {

		var chatMsg = $('.chat-message-control').val();
		if (chatMsg && isName) {
			e.preventDefault();
			//console.log(chatMsg);

			$('#chat-messages').append(
				'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">' + isName + '</span></div><div class="message-body"><p>' + chatMsg + '</p><div class="message-date">' + new Date(Date.now()).toLocaleString().slice(11, 19) + '</div></div></div></li>');
			$('#chat-body').scrollTop($(this).scrollMaxY);
			console.log($('#chat-body').scrollTop());
			$('.chat-message-control').val('');
			$.post('/api/chats', {
				name: isName,
				message: chatMsg
			}).done(function (data) {
				io.emit("send", data);
			});

		} else {
			$('.chat-message-control').focus();
		}
		//console.log(e);


	}

	$('.chat-message-send').on('click', function (e) {
		var userName = localStorage.getItem('username');
		var chatMsg = $('.chat-message-control').val();
		if (chatMsg && userName) {
			e.preventDefault();
			//console.log(chatMsg);

			$('#chat-messages').append(
				'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">' + userName + '</span></div><div class="message-body"><p>' + chatMsg + '</p><div class="message-date">' + new Date(Date.now()).toLocaleString().slice(11, 19) + '</div></div></div></li>');
			$('#chat-body').scrollTop($(this).scrollMaxY);
			console.log($('#chat-body').scrollTop());
			$('.chat-message-control').val('');
			$.post('/api/chats', {
				name: isName,
				message: chatMsg
			}).done(function (data) {
				io.emit("send", data);
			});

		} else {
			$('.chat-message-control').focus();
		}
		//console.log(e);
		$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
	})




/*$('.chat-message-send').on({
	'click':sendclick,
	'keydown': function(ev){
		if (ev.keyCode == 13) 
			sendclick(ev)
	}
});*/