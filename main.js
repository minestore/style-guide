$(function() {

	$('label.radio').click(function(){
		$('input[name=entrega]').parents('label').not(this).addClass('fadeout').removeClass('checked');
		$(this).removeClass('fadeout').addClass('checked');
	});
});