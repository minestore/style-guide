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

	var sucesss = false;

	$(".btn").click(function(){
		$('.loading').addClass('fadein');
		$('.loading .mine-spinner').addClass('animated fadeInUp');

		setTimeout(function() { // artificial timeout simulating server response
			
			if (sucesss) {
				$('.container:last-child').show().css('opacity', '0');			
				$('.amount').css('width','');
			}
			
			$('.loading').addClass('fadeout');
			$('.loading .mine-spinner').addClass('fadeOutUp');

			$('.loading').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function(){

				$('.loading').removeClass('fadein fadeout');

				if (sucesss) {
					$('.container').first().addClass('animated fadeOutLeft');
					$('.container').first().one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function(){
						$('html, body').animate({scrollTop:0}, 'normal');
						$('.container').first().hide();
						$('.container:last-child').addClass('animated fadeInRight');	
						amountWidth();
					});
				} else {
					$('.alert').show();
					$('.loading .mine-spinner').removeClass('fadeInUp fadeOutUp');
					$('html, body').animate({scrollTop:0}, 'normal');
				}
			});
		}, 2000);

	});

});

try {
	Typekit.load({
		active: function() {
     		amountWidth();
		}
	})
} catch(e) {}