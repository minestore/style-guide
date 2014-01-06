$(function() {

	$('label.radio').click(function(){
		if ($(this).closest('.form-section').hasClass('inactive')) {
		    return;
		}
		if ($(this).closest('.form-section').hasClass('activate')) {
		    $('.inactive').removeClass('inactive');
		}
		if ($(this).find('input[name=payment][value=boleto]').length) {
		    $('p.boleto').show();
		    $('.form-section.card').hide();
		} else if ($(this).find('input[name=payment]').length) {
			$('p.boleto').hide();
			$('.form-section.card').show();
		}
		$(this).closest('.form-section').find('.radio').not(this).addClass('fadeout').removeClass('checked');
		$(this).removeClass('fadeout').addClass('checked');
	});
});