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
      
      if($('#shipment').length) {
        $('#shipment').on('ifChecked ifUnchecked', function(event){
          if (event.type == 'ifChecked') {
            $('.block-shipment').addClass('open');
          } else{
            $('.block-shipment').removeClass('open');
          }
        });
      }

      if($('#stockControl').length) {
        $('#stockControl').on('ifChecked ifUnchecked', function(event){
          if (event.type == 'ifChecked') {
            $('#stockQty').val('').addClass('unlimited');
            $('#stockQty').prop('disabled', true);
          } else{
            $('#stockQty').prop('disabled', false);
            $('#stockQty').val('').removeClass('unlimited');
          }
        });
      }

      if($('#productTags').length) {
        $('#productTags').tagsInput({
           'height':'auto',
           'width':'100%',
           'interactive':true,
           'defaultText':'',
           'removeWithBackspace' : true
        });

      }
      
    }

  // init 

  mainNav();
  typekit();
  productShow();

});