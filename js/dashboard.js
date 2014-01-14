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


  // init 

  mainNav();

});