function amountWidth(parent) {
  parent = typeof parent !== 'undefined' ? parent : $('body');
  parent.find('.media-list, .form-section').each(function() {
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
        $(this).closest('form').find('.form-section.inactive').removeClass('inactive').find('select').removeAttr('disabled');;
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

  var sucesss = true;

  $(".btn").click(function(){
    var loading = $('.loading');
    var spinner = $('.loading .mine-spinner')
    var currentPage = $('.container').first();
    var newPage = $('.container:last-child');
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd';

    loading.addClass('fadein');
    spinner.addClass('animated fadeInUp');

    setTimeout(function() { // artificial 2s timeout simulating server response
      
      if (sucesss) {
        newPage.show().css('opacity', '0').find('.amount').css('width','');
      }

      spinner.addClass('fadeOutUp');
      loading.addClass('fadeout');

      loading.one(animationEnd, function(){

        loading.removeClass('fadein fadeout');

        if (sucesss) {
          currentPage.addClass('animated fadeOutLeft');
          currentPage.one(animationEnd, function(){
            $('html, body').animate({scrollTop:0}, 'normal');
            currentPage.hide();
            newPage.addClass('animated fadeInRight'); 
            amountWidth(newPage);
          });
        } else {
          $('html, body').animate({scrollTop:0}, 'normal');
          $('.alert').show();
          spinner.removeClass('fadeInUp fadeOutUp');
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