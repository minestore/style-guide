function amountWidth() {
	$.each($('.media-list, .form-section'), function() {
		maxWidth = 0;
		margin = 0;
		$(this).find('.amount').each(function(){
		    var itemWidth = $(this).outerWidth(false);
		    maxWidth = Math.max(maxWidth, itemWidth);
		    if($(this).parent().hasClass('radio')) margin = 20;
		}).width(maxWidth+margin);
	});
}

$(function() {

	$('label.radio').click(function(){
		if ($(this).closest('.form-section').hasClass('inactive')) {
		    return;
		}
		if ($(this).closest('.form-section').hasClass('activate')) {
		    $(this).closest('form').find('.form-section.inactive').removeClass('inactive');
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

	$('#credit-card').cardcheck();
	$(".sticky").scrollToFixed();

	$(".btn").click(function(){
		$('.loading').addClass('fadein');

		setTimeout(function() {
			$('html, body').animate({scrollTop:0}, 'slow');
			$('.loading').addClass('fadeout');
			setTimeout(function() {
				$('.loading').removeClass('fadein fadeout');
			}, 200);
		}, 3000);

	});

});

try {
	Typekit.load({
		active: function() {
     		amountWidth();
		}
	})
} catch(e) {}