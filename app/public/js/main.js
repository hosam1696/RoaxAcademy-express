$(function(){
	$("#social-icons").find('li i').on('click', function(){
		$("#social-icons").find('li i')
			.removeClass('hovered');
		$(this)
			.addClass('hovered');


		var info = $(this).data('info');
		$('#icons-info').html('<a href=\"'+info+'\" target="_blank">'+info+'</a>').fadeIn()
	});

	$('#send-mail').click(()=>{
		$.post('/api/sendemail', {
			name: 'محمد ماهر',
			email: 'test@gmail.com',
			mobile: '+20789667456',
			kind: 'معلم',
			day: ', الأحد السبت',
			year: 'الكل',
			subject: 'عربى',
			country: 'المملكة العربية السعودية',
			city: 'جدة',
			district: 'الحى الثانى',
			date: '5PM : 8PM'
		})
	})
});