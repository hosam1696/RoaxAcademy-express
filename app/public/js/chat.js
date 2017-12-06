/*
	$.getJSON('http://localhost:3000/api/feedbacks').done(
		function (data) {
			console.log(data)
		}
	);
*/

/**************************
 * document on ready logic
 ************************ */

/*var chatBody = document.getElementById('chat-body');
console.log(chatBody, chatBody.scrollTop);

	chatBody.scrollTop = 26;

var chatBody = document.getElementById('chat-body');
chatBody.scrollTop = chatBody.scrollHeight - chatBody.offsetHeight;
*/


$(function () {

	
	
	
	
	/*
	console.log($('#chat-body').prop('scrollHeight'), $('#chat-body').height())
	$('#chat-body').scrollTop('100px');*/


	$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());

	$.getJSON('/api/chats').done(function (data) {
		$('loader').hide();
		data.forEach(function(element) {
			$('#chat-messages').append(
				'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">'+element.name+'</span></div><div class="message-body"><p>'+element.message+'</p><div class="message-date">'+element.date.toLocaleString().slice(11, 19)+'</div></div></div></li>');
		}, this);
		$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
	});



});


/* **************************
	socket io logic
***************************** */

	var io = io();

	
	
	/*io.on('disconnection', function () {
		localStorage.removeItem('name');
	})*/

	io.on('test', function (data) {
		console.log("Data from server", data);
		io.emit("newTest", {name:"hosam", message: "message"});
	});

	io.on('someoneConnected', function () {
		console.log(localStorage.getItem('username')+" connected")
	});

io.on('chat-message', function (data) {
				console.log(data);
	
				
				$('#chat-messages').append(
					'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">'+data.name+'</span></div><div class="message-body"><p>'+data.message+'</p><div class="message-date">1/2/1976</div></div></div></li>');

					$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
				});

	$('.chat-message-send:disabled').css({
		'background-color': '#ccc',
		'cursor': 'not-allowed'
	});

	//localStorage.removeItem('name');
	var isName = localStorage.getItem('username');
	var chatSend = $('.chat-message-send');
	function initName() {
		chatSend.attr('disabled', false);
		$('.chat-message-name').val(isName);
		$('.name-checker-found').text(localStorage.getItem('username'));
		$('.name-checker').hide();
		$('#name-checked').show();
	}
	$('.leave-chat').on('click', ev=>{
		localStorage.removeItem('username');
		chatSend.attr('disabled', true);
		$('.name-checker').show();
		$('#name-checked').hide();
	})
	$('.chat-message-name').on('keydown', function(e){
		
		if (e.keyCode == 13) {
			e.preventDefault();
			localStorage.setItem('username', $(this).val());
			initName();
		}
	});
	if(isName) {
		initName();
	} else {
		chatSend.attr('disabled', true);
		$('#name-checked').fadeOut(0);
	}
	
	function sendclick(e) {
		
			var chatMsg = $('.chat-message-control').val();
			if(chatMsg && isName) {
				e.preventDefault();
				//console.log(chatMsg);
	
				$('#chat-messages').append(
					'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">'+isName+'</span></div><div class="message-body"><p>'+chatMsg+'</p><div class="message-date">'+new Date(Date.now()).toLocaleString().slice(11, 19)+'</div></div></div></li>');
				$('#chat-body').scrollTop($(this).scrollMaxY);
				console.log($('#chat-body').scrollTop());
				$('.chat-message-control').val('');
				$.post('/api/chats', {name:isName, message: chatMsg}).done(function (data){
					io.emit("send", data);
				});
	
			} else {
				$('.chat-message-control').focus();
			}
			//console.log(e);
			
		
	} 

	$('.chat-message-send').on('click', function (e) {
		
			var chatMsg = $('.chat-message-control').val();
			if(chatMsg && isName) {
				e.preventDefault();
				//console.log(chatMsg);
	
				$('#chat-messages').append(
					'<li><div class="single-message"><div class="person-avatar"><div class="img-placeholder"></div><span class="person-name">'+isName+'</span></div><div class="message-body"><p>'+chatMsg+'</p><div class="message-date">'+new Date(Date.now()).toLocaleString().slice(11, 19)+'</div></div></div></li>');
				$('#chat-body').scrollTop($(this).scrollMaxY);
				console.log($('#chat-body').scrollTop());
				$('.chat-message-control').val('');
				$.post('/api/chats', {name:isName, message: chatMsg}).done(function (data){
					io.emit("send", data);
				});
	
			} else {
				$('.chat-message-control').focus();
			}
			//console.log(e);
			$('#chat-body').scrollTop($('#chat-body').prop('scrollHeight') - $('#chat-body').innerHeight());
			
		
	} )
	/*$('.chat-message-send').on({
		'click':sendclick,
		'keydown': function(ev){
			if (ev.keyCode == 13) 
				sendclick(ev)
		}
	});*/




