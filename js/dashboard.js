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

      if( $('.inline-title').length ) {

        $('.editable-title').on('click',function(){
          $('.editable-title').addClass('active').focus();
          $('.inline-title .save, .inline-title .cancel').show();
        });

        $('.inline-title .cancel').on('click',function(){
          $('.editable-title').removeClass('active');
          $('.inline-title .save,.inline-title .cancel').hide();
        });

        // $('.editable-title').on('blur',function(){
        //   $('.editable-title').removeClass('active');
        //   $('.save, .cancel').hide();
        // });

        $('.inline-title .save').on('click',function(){

          $('.editable-title').attr('data-toggle','tooltip').attr('title','Woo hoo :)').attr('data-trigger','manual').tooltip('show');
          $('.editable-title').removeClass('active');
          $('.inline-title .save,.inline-title .cancel').hide();
          
          setTimeout(function(){
            $('.editable-title').tooltip('destroy');
          },2000);
        });
      }

      if( $('.product-description-content').length ) {

        var editor = new MediumEditor('.product-description-content', {
          anchorInputPlaceholder: 'www.exemplo.com.br',
          buttons: ['header1','bold', 'italic','anchor', 'unorderedlist'],
          buttonLabels: 'fontawesome',
          firstHeader: 'h1',
          secondHeader: 'h2',
          delay: 100,
          targetBlank: true
        });

        $('.product-description-content').on('click',function(){
          $(this).addClass('active').focus();
          $('.product-description').find('.save, .cancel').show();
        });

        $('.product-description .cancel').on('click',function(){
          $('.product-description-content').removeClass('active');
          $('.product-description .save, .product-description .cancel').hide();
        });

        $('.product-description .save').on('click',function(){

          $('.product-description-content').attr('data-toggle','tooltip').attr('title','Woo hoo :)').attr('data-trigger','manual').tooltip('show');
          $('.product-description-content').removeClass('active');
          $('.product-description .save, .product-description .cancel').hide();
          
          setTimeout(function(){
            $('.product-description-content').tooltip('destroy');
          },2000);
        });
      }

      if($('.edit-content').length) {
        $('.edit-content').on('click',function(){
          $('.editable-title').addClass('active');
          $('.product-description-content').addClass('active');
          $('.save, .cancel').show();
        });
      }
      
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
        var template = '<div class="col-xs-3"><div class="image"><div class="dz-preview dz-file-preview"><div class="dz-details"><a class="dz-remove" href="javascript:undefined;" data-dz-remove=""></a><a href="javascript:void(0);" class="dz-edit"></a><a href="#" class="dz-move"></a><div class="dz-filename"><span data-dz-name></span></div><div class="dz-size" data-dz-size></div><div class="dz-overlay"></div><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"></div><div class="dz-error-mark"></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div></div>';
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
                
                console.log(file);
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

        var featherEditor = new Aviary.Feather({
          apiKey: '392c33a577413954',
          apiVersion: 3,
          theme: 'light',
          tools: 'all',
          appendTo: '',
          onSave: function(imageID, newURL) {
           var img = document.getElementById(imageID);
           img.src = newURL;
          },
          onError: function(errorObj) {
           alert(errorObj.message);
          }
        });

        function launchEditor(id, src) {
          featherEditor.launch({
            image: id,
            url: src
          });
          return false;
        }

        $(document).on('click', '.dz-edit', function(e) {
          launchEditor('image1', 'http://images.aviary.com/imagesv5/feather_default.jpg');
          e.preventDefault();
        });

      }

      
    }

  // login
    function login() {
      if ($('#new-account').length) {
        
        $('#new-account').on('click', function(e){
          $('form.new-account').addClass('animated fadeInUp');
          e.preventDefault();
        });

        $('#create-store').on('click', function(e){
          var email = $('.new-account .e-mail').val();

          $.ajax({
              url: "http://www.minestore.com.br/leads",
              type: "POST",
              data: { email: email }
          }).done(function(data) {
              window.location.href = "/?blog_success=true";
              analytics.track('Captured Lead');
          }).fail(function(data) {
              analytics.track('Fail to capture Lead');
              $('.new-account .e-mail').addClass('animated shake');
              $('.new-account .e-mail').attr('placeholder', 'pode digitar o email de novo?').val('');
              setTimeout(function() {
                  $('.e-mail').removeClass('shake');
              }, 500);
          });
          e.preventDefault();
        })

      }
    }


  // init 

  mainNav();
  typekit();
  productShow();
  login();

});