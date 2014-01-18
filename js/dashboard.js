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

      if( $('#imagesUpload').length ) {
        var template = '<div class="col-xs-3"><div class="image"><div class="dz-preview dz-file-preview"><div class="dz-details"><a class="dz-remove" href="javascript:undefined;" data-dz-remove=""></a><a href="#" class="dz-edit" data-toggle="modal" data-target="#editImage"></a><a href="#" class="dz-move"></a><div class="dz-filename"><span data-dz-name></span></div><div class="dz-size" data-dz-size></div><div class="dz-overlay"></div><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"></div><div class="dz-error-mark"></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div></div>';
        var myDropzone = new Dropzone("#imagesUpload", { 
          thumbnailWidth: 400, 
          thumbnailHeight:400,
          previewTemplate : template,
          maxFilesize: 4096,
          init: function() {
            var totalFiles = 0,
                completeFiles = 0,
                emptyBlocksTemplate = '<div class="col-xs-3"><div class="image empty dz-message"></div></div>',
                emptyBlocksSingleTemplate = '<div class="col-xs-12"><div class="image empty full dz-message"></div></div>';

            this.on("addedfile", function (file) {
                totalFiles += 1;
            });

            this.on("removed file", function (file) {
                totalFiles -= 1;
                $(this).parent().remove();
            });

            this.on("complete", function (file) {
                completeFiles += 1;
                if (completeFiles === totalFiles) {
                  $('form.dropzone').find('.dz-message').remove();
                  
                  if ( totalFiles / 4 < 1 ) {
                    
                    var emptyBlocks = 4 - completeFiles;
                    $('form.dropzone').find('.image.empty').remove();
                    
                    for(var i = 0; i < emptyBlocks ;i++) {
                      $('form.dropzone').append(emptyBlocksTemplate);
                    }

                  } else if (totalFiles / 4 > 1 && totalFiles / 4 < 2 ) {
                    
                    var emptyBlocks = 8 - completeFiles;
                    $('form.dropzone').find('.image.empty').remove();
                    for(var i = 0; i < emptyBlocks ;i++) {
                      $('form.dropzone').append(emptyBlocksTemplate);
                    }
                  } else if ( totalFiles / 4 == 1 ) {
                    $('form.dropzone').append(emptyBlocksSingleTemplate);
                  }
                }
            });
          } 
        });


      }

      $('#imagesUpload').on('change', function() {
        console.log('1');
        if( $('.dropzone').hasClass('dz-started') ) {
          console.log('2');
          $('dz-message').hide();
          console.log('3');
        }      })

      
    }

  // init 

  mainNav();
  typekit();
  productShow();

});