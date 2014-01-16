// dashboard
// -------------------------

$(function() {

  // navigation behavior
    function mainNav() {
      if( $('.main-nav').length ) {
        
        $('.main-nav')
          .mouseover(function() {
            $(this).addClass('open');
          })
          .mouseout(function() {
            $(this).removeClass('open');
          });
      }
    }

  // iCheck
    if($('input').length) {
      $('input').iCheck({
        checkboxClass: 'icheckbox',
        radioClass: 'iradio'
      });
    }
    if($('input.stock').length) {
      $('input.stock').iCheck({
        checkboxClass: 'icheckboxStock'
      });
    }
    if($('input.switch').length) {
      $('input.switch').iCheck({
        checkboxClass: 'iSwitch'
      });
    }

  // typekit
    function typekit() {
      try {
        Typekit.load()
      } catch(e) {}
    }

  // product show
    function productShow() {
      
      // if($('#hasShipment').length) {
        $('#shipment').on('click', function(){
          if( $('#shipment').checked ) {
            $('.block-shipment').slideUp();
            console.log('oi');
          } else {
            $('.block-shipment').slideDown();
            console.log('tchau');
          }
        });

      // }
    }

  // init 

  mainNav();
  typekit();
  productShow();

});