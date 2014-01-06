function detailWidth() {
	$.each($('.media-list, .form-section'), function() {
		maxWidth = 0;
		margin = 0;
		$(this).find('.detail').each(function(){
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

try {
	Typekit.load({
		active: function() {
     		detailWidth();
		}
	})
} catch(e) {}