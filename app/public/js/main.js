$(function(){
	$("#social-icons").find('li i').on('click', function(){
		$("#social-icons").find('li i')
			.removeClass('hovered');
		$(this)
			.addClass('hovered');


		var info = $(this).data('info');
		$('#icons-info').html('<a href=\"'+info+'\" target="_blank">'+info+'</a>').fadeIn()
	});
});