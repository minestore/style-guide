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

  // typekit
    function typekit() {
      try {
        Typekit.load()
      } catch(e) {}
    }


  // init 

  mainNav();
  typekit();

});