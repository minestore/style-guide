$(function() {

	$('label.radio').click(function(){
		if ($(this).closest('.form-section').hasClass('inactive')) {
		    return;
		}
		if ($(this).closest('.form-section').hasClass('activate')) {
		    $('.inactive').removeClass('inactive');
		}
		if ($(this).find('input[name=payment][value=boleto]').length) {
		    $('p').show();
		} else if ($(this).find('input[name=payment]').length) {
			$('p').hide();
		}
		$(this).closest('.form-section').find('.radio').not(this).addClass('fadeout').removeClass('checked');
		$(this).removeClass('fadeout').addClass('checked');
	});
});