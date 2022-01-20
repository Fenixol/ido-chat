$(function() {

    $('#modal').on('shown.bs.modal', function () {
        $('.add-multiple-items-form').submit(function(event){
            event.preventDefault();

            if($("#categoryList").chosen().find("option:selected" ).text()==''){
                if(!$( "#categoryList" ).parent().parent().hasClass('has-error')){
                    $( "#categoryList" ).parent().append('<p class="help-block">Item name cannot be blank.</p>');
                    $( "#categoryList" ).parent().parent().addClass('has-error');
                }
            }else{
                $( "#categoryList" ).parent().parent().removeClass('has-error');
                $( "#categoryList").parent().find('.help-block').remove();
            }


            $( '.add-multiple-items-form' ).find( '.required' ).each(function(){
                if( $( this ).val() ==''){
                    if(!$( this ).parent().parent().hasClass('has-error')){
                        $( this ).parent().append('<p class="help-block">Item name cannot be blank.</p>');
                        $( this ).parent().parent().addClass('has-error');
                    }
                } else {
                    $( this ).parent().parent().removeClass('has-error');
                    $( this ).parent().find('.help-block').remove();
                }

            });

        })
$('.parent_category').on('change', function(){
        var id = $(this).val();
        var url = $(this).data('url');
        var subcat = $(this).data('subcat');
        $.ajax({
            url:url,
            method:"POST",
            data:{"cat_id":id},
            success:function(data){
                $(subcat).chosen("destroy");
                $(subcat).html( data );
                $(subcat).chosen({disable_search_threshold: 10});
            }
        })
    })
    });

    

});