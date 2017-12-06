/**
 * Created by Hossam Elnabawy on 12/01/2017.
 */

$(function () {
	//$('#feedback .most-recent').load('api/feedbacks');
	$("#form-feedback").on('submit', function(event) {
		event.preventDefault();
		var name = $("#feedname").val();
		var msg = $("#feedmsg").val();
		if (name && msg) {
			$.post('/api/feedbacks', {
				name: name,
				message: msg,
				date: Date.now()
			}).done(function(data) {
				
				$('#feedback .most-recent').prepend(`\
					<blockquote class="jumbtron">
					<p> &quot; ${donData.message} &quot;</p>
				<cite>
	                <small><i class="glyphicon glyphicon-comment text-muted "></i> ${donData.name}  &nbsp; | &nbsp;  &nbsp; ${new Date(donData.date).toDateString()}</small></cite>
					</blockquote>`);

				});
		}

	});
	function getData() {
		$.getJSON('/api/feedbacks', function (data) {
			let feedbacksBody = $('#feedback .most-recent');
			data = data.reverse();
			data.forEach(function(data){
				
				feedbacksBody.html(feedbacksBody.html()+ `
			<blockquote class="jumbtron">
	            <p> &quot; ${data.message} &quot;</p>
	            <cite>
	                <small><i class="glyphicon glyphicon-comment text-muted "></i> ${data.name}  &nbsp; | &nbsp;  &nbsp; ${new Date(data.date).toDateString()}</small></cite>
	        </blockquote>
			`);
			})
		});
	}

	getData();
});