var ajaxTimeout = 60000;
var ajaxTimeoutMessage = 'The request is aborted due to timeout';
var snackbarDelay = 3000;
var browserTitleSeparator = ' &#8211; ';

// window.onscroll = function() {
//     // var scrolled = window.pageYOffset || document.documentElement.scrollTop;
//     // //document.getElementById('showScroll').innerHTML = scrolled + 'px';
//     // console.log(scrolled + 'px');
//     //console.log('scroll1111');
// };

$(function() {

    if($('#knowledgebaseentry-content').length){
        CKEDITOR.replace( 'knowledgebaseentry-content' );
    }
    if($('#venuedesigninspirationtheme-description').length){
        CKEDITOR.replace( 'venuedesigninspirationtheme-description' );
    }
    if($('#notetext').length){
        CKEDITOR.replace( 'notetext' );
    }
//    if($('.ckeditor').length == 1){
//        CKEDITOR.replace($('.ckeditor').attr('id'));
//    }
    if($('#about_us').length){
        CKEDITOR.replace( 'about_us' );
    }
    if($('#agreement-text').length){
        CKEDITOR.replace( 'agreement-text' );
    }
    if($('#agreementtext').length){
        CKEDITOR.replace( 'agreementtext' );
    }
    // if($('#venuelocation-description').length){
    //     CKEDITOR.replace( 'venuelocation-description' );
    // }
    if($('#venuelocation-calendar_text').length){
        CKEDITOR.replace( 'venuelocation-calendar_text' );
    }
    if($('#venueoffer-description').length){
        CKEDITOR.replace( 'venueoffer-description' );
    }
    if($( ".datepicker_icon" ).length){
	    $( ".datepicker_icon" ).datepicker({
	        showOn: "both",
	        dateFormat: 'yy-m-d',
	        buttonImage: "/images/svg/calendar.svg",
	        buttonImageOnly: true,
	        buttonText: "Select date"});
	}


    var disconnectStripe = function(){
        $('.disconnect-stripe').click(function(e){
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            $.ajax({
                url: '/stripe/revoke-stripe-connect',
                method: 'post',
                data:{
                	oid: $(this).data('id')
				},
                dataType: 'json',
                success: function(data){
                    alert(data.msg);
                    location.reload();
                },
                fail: function(data){
                    console.log(data);
                }
            });
        });
	};
    disconnectStripe();

    var calculateCurrency = function () {
        $('.calculate_currency').on('keyup', function(){
        	var dataId = $(this).data('id');
            var rate = parseFloat($('.rate_' + dataId).data('rate'));
            var buffer = parseFloat($('.rate_' + dataId + ' .buffer-input').val());
            var control_amount = parseFloat($('.rate_' + dataId + ' .currency-control_amount').val());
            if(rate && buffer && control_amount) {
                $('.rate_' + dataId + ' .usd_amount').html(eval(control_amount/rate).toFixed(2));
                $('.rate_' + dataId + ' .usd_buffer_amount').html(eval(control_amount/rate*buffer).toFixed(2));
            }
        });
    };
    if($('.calculate_currency').length){
        calculateCurrency();
	}

    var updateRates = function(){
        $('.update-rates').click(function(e){
            e.preventDefault();
            $(this).attr('disabled', true);
            $('.update-rates .fa').show();

            var cid = $(this).data('cid');

            $.ajax({
                url: '/api/currency/save-rates?id='+cid,
                method: 'post',
                data:{
                    cid: cid
                },
                dataType: 'json',
                success: function(data){
                    if(data.status === 'error'){
                    	alert('Error');
					} else {
                    	window.location.reload();
					}
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
    };
    updateRates();

    var addNewCurrency = function(){
        $('.btn-add-currency').click(function(e){
            e.preventDefault();
            $(this).attr('disabled', true);
            $('.btn-add-currency .fa').show();

            $.ajax({
                url: '/api/currency/add-currency?code=' + $('.add_currency').val(),
                method: 'post',
                data:{},
                dataType: 'json',
                success: function(data){
                    if(data.status === 'error'){
                        alert('Error');
                    } else {
                        window.location.reload();
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
    };
    addNewCurrency();

    var deleteCurrency = function(){
        $('.delete-currency').click(function(e){
            e.preventDefault();

            if(!confirm('Do you want to delete currency?'))
                return;

            $.ajax({
                url: '/api/currency/delete-currency?id=' + $(this).data('id'),
                method: 'post',
                data:{},
                dataType: 'json',
                success: function(data){
                    if(data.status === 'error'){
                        alert('Error');
                    } else {
                        window.location.reload();
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
    };
    deleteCurrency();

	$(document).on('pjax:start', function() {
		$('#preloader').show();
	});

	$(document).on('pjax:end', function() {
		$('#preloader').hide();
	});

	$("a[disabled='disabled'], .disabled_form a, .disabled_form  button, .disabled_form button.input[type='file'], [disabled='1'] a").on('click', function(e){
	    	if(!$(this).hasClass('dropdown-toggle') && !$(this).parents('.dropdown-menu').find('li').length) {
	      	
	       		e.preventDefault();
	        	return false;
		      }else {
		      	return true;
		      }
    })

    $("form.check_disabled a, form.check_disabled button").on('click', function(e){
	    	if(!$(this).hasClass('dropdown-toggle') && !$(this).parents('.dropdown-menu').find('li').length && $(this).closest('form').data('disabled') == 1) {
	      	
	       		e.preventDefault();
	        	return false;
		      }else {
		      	return true;
		      }
    })

//	$(document).on('ready pjax:end', function() {
	$(document).ready(function() {
		/*
		 * Keep scroll positions on reload
		 * Cookie array structure:
		 * \[\[selector1, scrollTop value, scrollLeft value\], \[selector2, scrollTop value, scrollLeft value\], ...\]
		 */
		var scrollOnload = getCookie('scrollOnload');
		if (scrollOnload.length) {
			var params = JSON.parse(scrollOnload);
			$.each(params, function(key, val) {
				$(val[0]).scrollTop(val[1]).scrollLeft(val[2]);
			});
			setCookie('scrollOnload', '', 7);
		}
		
		$('.single_venue .a_delete').on('click', function(e){
			e.preventDefault();
			$('.confirm-form').on("beforeSubmit", function(){return false;})
			var obj = $(this);
			//$(this).prev().prop('checked', true);
			//$(this).closest('.inner_venue').hide();
			$('body').on('click', '#modal .confirm .btn-primary', function() {
	
				$('#modal').modal('hide');
				obj.prev().prop('checked', true);
				obj.closest('.single_venue').hide();
			});
		})

		$('.grid-view table tbody tr:first-child').addClass('active');
		$('.grid-view table tr').on('click',function(){
			$('.grid-view table tr').removeClass('active');
			$(this).addClass('active');
		})

		/*** Week Picker ***/
		var weekPicker = function() {
			var activateWeek = function($selector) {
				window.setTimeout(function() {
					$row = $('.ui-state-active', $selector).closest('tr');
					$('td a', $row).addClass('ui-state-active');
				}, 1);
			};
			var initWeekHover = function($selector) {
				window.setTimeout(function() {
					$('.ui-datepicker-calendar tr', $selector).on('mousemove', function() {
						$(this).find('td a').addClass('ui-state-hover');
					});
					$('.ui-datepicker-calendar tr', $selector).on('mouseleave', function() {
						$(this).find('td a').removeClass('ui-state-hover');
					});
				}, 1);
			}
			$('.week-picker').each(function() {
				var defaultDate = $(this).data('default-date');
				$(this).datepicker({
					defaultDate: new Date(defaultDate),
					showOtherMonths: true,
					selectOtherMonths: true,
					onChangeMonthYear: function() {
						if ($(this).data('type') == 'week') {
							activateWeek(this);
							initWeekHover(this);
						}
					},
					onSelect: function(dateText) {
						if ($(this).data('type') == 'week') {
							activateWeek(this);
						}
						var d = new Date(dateText);
						if ($(this).data('type') == 'week') {
							d.setDate(d.getDate() - d.getDay());
						}
						$('#' + $(this).data('month-input-id')).val(d.getMonth() + 1);
						$('#' + $(this).data('day-input-id')).val(d.getDate());
						$('#' + $(this).data('year-input-id')).val(d.getFullYear());
//						$('#day').trigger('change');
						$('#' + $(this).data('day-input-id')).trigger('change');
//					var d = new Date(dateText);
//					var loc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
//					location.href = time_url + Math.floor(loc/1000);
					}
				});
				if ($(this).data('type') == 'week') {
					activateWeek(this);
					initWeekHover(this);
				}
			});
		}
		weekPicker();

		if($('.birthday_picker').length){
			$('.birthday_picker').datepicker({
				showOn: "button",
				buttonImage: "/images/main/btn_open_custom_calendar.png",
				buttonImageOnly: true,
				buttonText: "Select date",
			});
		}

		$('select.chosen-style').chosen({disable_search_threshold: 14});
		$('#per_page').chosen({disable_search_threshold: 10});
		//$('select.filter_field').chosen({disable_search_threshold: 12});
		// $('select.edit_section').chosenIcon({disable_search: true});
		//$('.custom_checkbox').styler({});
		//$('input[type=checkbox]').styler({});
		//$('input[type=radio]').styler({});
		//$(".drop_b").niceScroll({horizrailenabled: false});
		// $('.filter').niceScroll({});
		// $('.scroll_obj').niceScroll({cursorwidth:"10px", cursoropacitymin:"0.3", cursoropacitymax: "0.9"});  //cursorcolor:"aquamarine",
		// $('.scrollable_list').niceScroll({cursorwidth:"10px", cursoropacitymin:"0.3", cursoropacitymax: "0.9"});
		// $('div.adm-content').niceScroll({cursorwidth:"10px", cursoropacitymin:"0.3", cursoropacitymax: "0.9"});
		// $('div.checkbox_list').niceScroll({horizrailenabled: false});
		
		/*** Filters ***/
//		$('.clear_all_filter').on('click', function(){
	$('body').on('click', '.clear_all_filter', function() {
			$('.filter input[type="text"]').val('');
			$('.filter select').val('');
			$('.filter input[type="checkbox"]').removeAttr('checked');
			$('.filter select').trigger("chosen:updated");
			//$('.filter').find('form').submit();
			$(this).closest('form').submit();
		});
//		$('.clear_filter').on('click', function(){
	$('body').on('click', '.clear_filter', function() {
			$(this).closest('.select_wrapper').find('input[type="text"]').val('');
			$(this).closest('.select_wrapper').find('select').val('').trigger("chosen:updated");
			$(this).closest('.select_wrapper').find('input[type="checkbox"]').removeAttr('checked');
			//$('.filter').find('form').submit();
			$(this).closest('form').submit();
		})
//		$('.filter_field').on('change', function(){
	$('body').on('change', '.filter_field', function() {
			if($(this).hasClass('region_id')) {
				$('#location_block').html('<li>No data yet</li>');
				$('.destination_id').val('').trigger('refresh');
			}
			//$('.filter').find('form').submit();
			$(this).closest('form').submit();
		})
	$('body').on('change', '.filter_field_datepicker .krajee-datepicker', function() {
			if($(this).hasClass('region_id')) {
				$('#location_block').html('<li>No data yet</li>');
				$('.destination_id').val('').trigger('refresh');
			}
			//$('.filter').find('form').submit();
			$(this).closest('.filter_field_datepicker').find('input').val($(this).val());
			$(this).closest('form').submit();
		})
	$('body').on('beforeSubmit', '.filter-form', function() {
		var container = ($(this).closest('#modal').length > 0) ? '#modal' : '#main';
		var $form = $(this);
		var method = $(this).attr('method');
		if(!method)
			method = 'POST';
		var data = $form.data('yiiActiveForm');
		$.each(data.attributes, function() {
			this.status = 3;
		});
		$form.yiiActiveForm('validate');
		if ($(container).find('.has-error').length) {
			return false;
		}
		$('[type=submit]', this).attr('disabled', true);
		$.ajax({
			url: $form.attr('action'),
			method: method,
			data: $form.serialize(),
			context: this,
			timeout: ajaxTimeout,
			complete: function () {
				$('[type=submit]', this).attr('disabled', false);
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else if (jqXHR.status == 302) {
					return;
				} else {
					message = jqXHR.responseText;
				}
				Snackbar({text: message, type: 'danger'});
//				$(container + ' .alert-danger').html(message).show();
//				$('body,html').animate({scrollTop: 0}, 400);
			},
			success: function(data) {
				if(data.reload) {
					
					$('#modal').hide();
					location.reload();
				}
				else {
					if($('.ajax_info').length){
						$('.ajax_info').html(data);
					} else {
						$('#modal .ajax-content').html(data);
					}
					
					$('select.chosen-style').chosen({disable_search_threshold: 14});
					$('select.filter_field').chosen({disable_search_threshold: 12});
					//init_filter();
					//formSubmit()
					return false;
				}
			}
		});
		return false;
	});
		$('.owner_depended_field').on('change', function() {
			var type = $('.customer-owner_type:checked').val();
			var owner_id = 1;
			if(type != 'own') {
				owner_id = $('.owner_'+type).val();
			}
			$.ajax({
                 url: '/mastertable/sales-rep-id' + '?owner_id='+owner_id,
                 dataType: 'html',
                 type: 'post',
                 data: {},
                 success: function(data){
                     $('.owner_depended').html(data);
                 },
                 error: function(){
                     console.log('Error');
                 }
            })
		})
	
		$('.to-archive').on('click', function(){
			var url = $(this).val();
			$.ajax({

				url: url,

				dataType: 'json',

				error: function(jqXHR) {

					var message;

					if (jqXHR.status == 0) {

						message = ajaxTimeoutMessage;

					} else {

						message = jqXHR.responseText;

					}

					$('#modal .error .alert-danger').html(message).show();

					$('#modal .error').show();

				},
				success: function (data) {

					$('.venue_filter').submit();

				}
			});
		})

		$('.edit_section').on('change', function(){
			if($(this).children('option:selected').attr('data-href')) {
				location.href = $(this).children('option:selected').attr('data-href');
			}
		})

	});

	$( document ).ajaxComplete(function() {
		$('select.chosen-style').chosen({disable_search_threshold: 10});
		//$('.custom_checkbox').styler({});
		//$('input[type=checkbox]').styler({});
	});

	var handleAdminPanels = function(){
        var $filter = $('.filter');
        init();        $('body').on('click', '.filter_btn', function() {
            showAdmFilterPanel();
        });

        $('body').on('click', '.open-nav-bnt', function() {
            save(true, 'admin_panel');
        });

        $('body').on('click', '.close-nav-bnt', function() {
            save(false, 'admin_panel');
        });

        $('body').on('change', '#show_preview', function() {
        	if($(this).prop('checked')){
        		save(true, 'preview_panel');
        		previewPanel(1);
        	}
        	else {
        		save(false, 'preview_panel');
        		previewPanel(0);
        	}
        })

        function init(){
            if(typeof yiiSett !== 'undefined'){

                if(yiiSett.filterPanel === 'opened'){
                    showAdmFilterPanel(true);
                }
                if(yiiSett.adminPanel === 'opened'){
                    openNav();
                } else {
                    closeNav();
                }
                if($('#show_preview').length) {
	                if(yiiSett.previewPanel === 'opened'){
	                    previewPanel(1);
	                } else {
	                	previewPanel(0);
	                }
	            }
            }
		}

        function showAdmFilterPanel(init = false){
        var $filter = $('.filter');
            if($filter.hasClass('none'))
                return false;

if (init === false || $('#conv-app').length === 0) {
            $filter.toggleClass('closed opened');
}
            $('.filter_btn').toggleClass('act not_act');

yiiSett.filterPanel = ($filter.hasClass('opened')) ? 'opened' : 'closed';
            save($filter.hasClass('opened'), 'filter_panel');
        }

        function save(opened, id) {
            $.ajax({
                url: '/site/options?id=' + id,
                dataType: 'json',
                type: 'post',
                data: {
                    opened: opened
                },
                success: function(data){
                    if(data.status === 'error'){
                        console.log('Error');
                    }
                },
                error: function(){
                    console.log('Error')
                }
            })
        }
        function previewPanel(open){
        	if(open == 1) {
        		$('#show_preview').prop('checked','checked').trigger('refresh');
        		$('.preview').show();
				$('.adm-table').css({marginRight:'300px'});
        	} else {
        		$('#show_preview').prop('checked',false).trigger('refresh');
        		$('.preview').hide();
				$('.adm-table').css({marginRight:'0px'});
        	}
        }
    };

    handleAdminPanels();




	// function list_resize() {

	// 	var main_class = "col-md-12";
	// 	var  window_width = $(document).width();
	// 	var main_width = parseFloat(window_width);
	// 	var preview_width = parseFloat($('.preview').outerWidth());
	// 	var filter_width = parseFloat($('.filter').outerWidth());
	// 	if (($('.preview').css('display') == 'block' && $('.filter').css('display') == 'none') || ($('.preview').css('display') == 'none' && $('.filter').css('display') == 'block')){
	// 		main_class = 'col-md-10';
	// 		if($('.filter').css('display') == 'none')
	// 			main_width = eval(window_width - preview_width);
	// 		if($('.preview').css('display') == 'none')
	// 			main_width = eval(window_width - filter_width);
	// 		console.log('full='+window_width+'preview='+$('.preview').width()+' filter='+filter_width+' main='+main_width);
	// 	}

	// 	if ($('.preview').css('display') == 'block' && $('.filter').css('display') == 'block') {
	// 		main_class='col-md-8';
	// 		main_width = eval(window_width - preview_width - filter_width);
	// 	}
	// 	$('.list').removeClass('col-md-8').removeClass('col-md-10').removeClass('col-md-12');
	// 	$('.list').addClass(main_class);
	// 	$('.list').css('width', main_width);
	// }


	/*** AJAX FORMS & REQUESTS ***/

//	$('.link-ajax-request').on('click', function(e) {
	$('body').on('click', '.link-ajax-request', function(e) {
		e.preventDefault();
		var url;
		if ($(this).is('a')) {
			url = $(this).attr('href');
		} else if ($(this).is('button')) {
			url = $(this).attr('value');
			$(this).attr('disabled', true);
		} else {
			return;
		}
		if ($(this).data('enable-preloader')) {
			$('#preloader').show();
		}
		$.ajax({
			url: url,
			type: 'POST',
			timeout: ajaxTimeout,
			context: this,
			complete: function() {
				if ($(this).is('button')) {
					$(this).attr('disabled', false);
				}
				if ($(this).data('enable-preloader')) {
					$('#preloader').hide();
				}
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else if (jqXHR.status == 302) {
					return;
				} else {
					message = jqXHR.responseText;
				}
				Snackbar({text: message, type: 'danger'});
			},
			success: function(data) {
				var success = true;
				if (data.alert !== undefined && data.alert != '') {
					success = false;
					Snackbar({text: data.alert, type: 'danger'});
				}
				if (data.message !== undefined && data.message != '') {
					Snackbar({text: data.message});
				}
				if (success) {
					if ($(this).data('callback-onsuccess')) {
						window[$(this).data('callback-onsuccess')]();
					}
					if ($(this).data('reload-onsuccess') == true) {
						if ($(this).data('keep-scroll-onreload') !== undefined) {
							var selectors = $(this).data('keep-scroll-onreload').split(',');
							var params = [];
							$.each(selectors, function(key, val) {
								params[key] = [val, $(val).scrollTop(), $(val).scrollLeft()];
							});
							params = JSON.stringify(params);
							setCookie('scrollOnload', params, 7);
						}
						location.reload();
					}
				}
			}
		});
	});

	$('.button-ajax-form').on('submit', function(e) {
		e.preventDefault();
		$('#preloader').show();
		$.ajax({
			url: $(this).attr('action'),
			method: 'POST',
			timeout: ajaxTimeout,
			data: $(this).serialize(),
			context: this,
			complete: function() {
				$('#preloader').hide();
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else if (jqXHR.status == 302) {
					return;
				} else {
					message = jqXHR.responseText;
				}
				Snackbar({text: message, type: 'danger'});
			},
			success: function(data) {
				if ($(this).data('reload-onsuccess') == true) {
					if ($(this).data('keep-scroll-onreload').length) {
						var selectors = $(this).data('keep-scroll-onreload').split(',');
						var params = [];
						$.each(selectors, function(key, val) {
							params[key] = [val, $(val).scrollTop(), $(val).scrollLeft()];
						});
						params = JSON.stringify(params);
						setCookie('scrollOnload', params, 7);
					}
					location.reload();
				}
			}
		});
	});


	// kendo numeric

	$(".form-control-numeric").kendoNumericTextBox({
		format: "n0"
	});

	$(".form-control-numeric-percent input").kendoNumericTextBox({
	   format: "# '%'",
	   spinners: false

	});
	
	$(".form-control-numeric-nospinners").kendoNumericTextBox({
		format: "n0",
		spinners: false
	});
	$(".form-control-decimal").kendoNumericTextBox({
		format: "n2"
	});


	$('#modal').on('hidden.bs.modal', function () {
		$(this).removeClass($(this).data('custom-class'));
	})

	$('body').on('click', '.modal-ajax', function(e) {
		e.preventDefault();

		$('#modal').modal('hide');
		$('#main .alert-danger').hide();
		$('#main .alert-success').hide();
		$('#preloader').show();
		var url;
		if ($(this).is('a')) {
			url = $(this).attr('href');
		} else if ($(this).is('button')) {
			url = $(this).attr('value');
		} else {
			return;
		}
		$('#modal .ajax-content').hide();
		$('#modal .error').hide();
		$('#modal .confirm').hide();
//		$('#modal .loading').show();
		$('#modal').data('custom-class',$(this).data('modal-custom-class'));
		$('#modal').addClass($(this).data('modal-custom-class'));
//		$('#modal').modal('show');
//		$('#modal .modal-dialog').hide();
	
		$.ajax({
			url: url,
			timeout: ajaxTimeout,
			complete: function () {
				$('#preloader').hide();
//				$('#modal .modal-dialog').show();
//				$('#modal .loading').hide();
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else {
					message = jqXHR.responseText;
				}
//				$('#modal .error .alert-danger').html(message).show();
//				$('#modal .error').show();
				Snackbar({text: message, type: 'danger'});
				return false;
			},
			success: function (data) {
				$('#modal .modal-body .ajax-content').html(data).show();
				$('#modal').modal('show');
			}
		});
	});

	$('body').on('click', '.modal-confirm', function() {
		$('#modal .ajax-content').hide();
		$('#modal .error').hide();
		$('#modal .loading').hide();
		var message = $(this).attr('data-message');
		if (message !== undefined) {
			$('#modal .confirm-message').html(message);
		}
		var title = $(this).attr('data-title');
		if (title !== undefined) {
			$('#modal .modal-title').html(title);
		}
		var buttonPrimaryText = $(this).attr('data-button-primary-text');
		if (buttonPrimaryText !== undefined) {
			$('#modal .confirm .btn-primary').html(buttonPrimaryText);
		}
		$('#modal .confirm-form').attr('action', $(this).attr('value'));
	
		$('#modal .confirm').show();
		$('#modal').modal('show');
	});

	$('body').on('click', '#modal .confirm .btn-customer-general', function() {
	
		$('#modal').modal('hide');
		if ($(this).data('click') !== undefined) {
			$($(this).data('click')).click();
		}
	});

	$('form').on('afterValidate', function (event, messages, errorAttributes) {
		if (errorAttributes.length) {
			Snackbar({text: 'Error! ' + messages[errorAttributes[0].id][0], type: 'danger'});
		}
/*		if ($('.has-error', this).length) {
			$('.has-error', this).each(function() {
				Snackbar({text: 'Error! ' + $(this).find('.help-block').html(), type: 'danger'});
				return false;
			});
		}*/
	});

	$('body').on('beforeSubmit', '.ajax-form', function() {
		var container = ($(this).closest('#modal').length > 0) ? '#modal' : '#main';
//		$(container + ' .alert-danger').hide();
		var $form = $(this);
		var data = $form.data('yiiActiveForm');
		$.each(data.attributes, function() {
			this.status = 3;
		});
		$form.yiiActiveForm('validate');
		if ($(container).find('.has-error').length) {
			return false;
		}
		$('[type=submit]', this).attr('disabled', true);
		var formData = new FormData(this);
		$.ajax({
			url: $form.attr('action'),
			method: 'POST',
			data: formData,//$form.serialize(),
			processData: false,
			contentType: false,
			context: this,
			timeout: $(this).data('timeout') || ajaxTimeout,
			complete: function () {
				$('[type=submit]', this).attr('disabled', false);
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else if (jqXHR.status == 302) {
					return;
				} else {
					message = jqXHR.responseText;
				}
				Snackbar({text: message, type: 'danger'});
//				$(container + ' .alert-danger').html(message).show();
//				$('body,html').animate({scrollTop: 0}, 400);
			},
			success: function(data) {
				console.log('success');
				var success = true;
				var alert = false;
				if (data.errors !== undefined && !$.isEmptyObject(data.errors)) {
					console.log('errors');
					success = false;
					$.each(data.errors, function(key, val) {
						$('.field-' + key).addClass('has-error');
						$('.field-' + key + ' .help-block').html(val);
					});
					if ($('.has-error', this).length) {
						$('.has-error', this).each(function() {
							alert = 'Error! ' + $(this).find('.help-block-error').html();
							return false;
						});
					}
					if ($(this).data('callback-onerrors')) {
						window[$(this).data('callback-onerrors')](data);
					}
				}
				if (data.alert !== undefined && data.alert != '') {console.log('errors2');
					success = false;
					alert = data.alert;
//					Snackbar({text: data.alert, type: 'danger'});
//					$(container + ' .alert-danger').html(data.alert).show();
//					$('body,html').animate({scrollTop: 0}, 400);
				}
				if (alert != false) {
					Snackbar({text: alert, type: 'danger'});
				}
				if (success) {
					if (container == '#modal') {
						$('#modal').modal('hide');
					}
					if (data.reload !== undefined && data.reload) {
						location.reload();
					}

//					if (data.pjax_reload !== undefined) {
//						$.pjax.reload({
//							container: data.pjax_reload
//						});
//					}
					if (data.message !== undefined && data.message.length) {
						Snackbar({text: data.message});
//						$(container + ' .alert-success').html(data.message).show();
//						$('body,html').animate({scrollTop: 0}, 400);
					}
					//if (data.redirect !== undefined && data.redirect.length) {
					//	setTimeout(function(){location.href = data.redirect;}, 300);
						
					//}
					if ($(this).data('reload-onsuccess') == true) {
						if ($(this).data('keep-scroll-onreload') !== undefined) {
							var selectors = $(this).data('keep-scroll-onreload').split(',');
							var params = [];
							$.each(selectors, function(key, val) {
								params[key] = [val, $(val).scrollTop(), $(val).scrollLeft()];
							});
							params = JSON.stringify(params);
							setCookie('scrollOnload', params, 7);
						}
						location.reload();
					}
				}
			}
		});
		return false;	});
	

	$('body').on('submit', 'form.ajax-form', function(e) {
		e.preventDefault();
	});

	$('body').on('click', '#modal .btn-cancel', function() {
		$('#modal').modal('hide');
	});

	$('#modal .confirm-form').on('submit', function() {
		$('#modal').modal('hide');
	});

	/***/
	function openPanel() {
		var winWidth = $(window).width();
		if (winWidth > 750) {
			$('.left_panel').hover(function() {
				$(this).addClass('open');
			}, function() {
				$(this).removeClass('open');
			});
		} else {
			$('.left_panel').hover(function() {
				$(this).removeClass('open');
			});
		}
	}
	openPanel();

	$('.item_list li').click(function() {
		$(this).addClass('active');
		$('.item_list li').not(this).removeClass('active');
	});

	// function leftPanelHeight() {
	// 	var winWidth = $(window).width();
	// 	var PanelHeight = $('.main_wrapper').height();
	// 	if (winWidth > 750) {
	// 		$('.left_panel').css('height', PanelHeight).attr('style','');
	// 		$('.item_list').getNiceScroll().remove();
	// 	} else {
	// 		$('.left_panel').css('height', 'auto');
	// 		$('.item_list').niceScroll({cursorcolor:"#fff", cursoropacitymax: "0.7"});
	// 	}
	// }
	// leftPanelHeight();

	$('.mob_btn').click(function() {
		if ($(this).hasClass('clicked')) {
			$('.left_panel').animate({ width: '256px' }, 500);
			$(this).removeClass('clicked');
		} else {
			$('.left_panel').animate({ width: '0' }, 500);
			$(this).addClass('clicked');
		}
	});

	function listMenu() {
		$('.left_panel:not(.open)').find('.item_list li a').click(function() {
			$('.left_panel:not(.open)').css('width', '0');
			$('.mob_btn').addClass('clicked');
		});
	}
	// function listResize() {
	// 	if($('.venue-index .list').length > 0) {
	// 		$('.venue-index .list .grid-view').height((parseFloat($(window).height()) - 120)+'px');
	// 	}
	// }
	listMenu();

	$(document).click(function(event) {
		var winWidth = $(window).width();
		if (winWidth < 750) {
			if ($(event.target).closest('.left_panel:not(.open)').length == 0 && $(event.target).attr('class') != 'mob_btn') {
				$('.left_panel:not(.open)').animate({ width: '0' }, 500);
				$('.mob_btn').addClass('clicked');
			}
		}
	});

//	$(document).on('ready pjax:end', function() {
	$(document).ready(function() {
		//listResize();
		// $('.doc_table td:first-child, .doc_table td:nth-child(2)').hover(function() {
		// 	$('.arrows').hide();
		// 	$(this).parent('tr').find('.arrows').show();
		// }, function() {
		// 	$(this).parent('tr').find('.arrows').hide();
		// });
		$('.multiselect_box label').change(function() {
		if( $(this).hasClass('active') ) {
			$(this).removeClass('active');
		}
		else {
			$(this).addClass('active');
		}
	});

	$('.select_wrapper .select_all').change(function(){
		if($(this).is(':checked') === true) {
			$(this).closest('.select_wrapper').find('input[type=checkbox]').prop('checked', true);
			$(this).closest('.select_wrapper').find('input[type=checkbox]').closest('label').addClass('active');
		}
		else {
			$(this).closest('.select_wrapper').find('input[type=checkbox]').prop('checked', false);
			$(this).closest('.select_wrapper').find('input[type=checkbox]').closest('label').removeClass('active');
		}
		$('.filter').find('form').submit();
	})

	$('.selectAllVenueOptions .select_all').change(function(){
		if($(this).is(':checked') === true) {
			$(this).closest('.selectAllVenueOptions').find('.checkbox_list input[type=checkbox]').prop('checked', true).trigger('change');
			$(this).closest('.selectAllVenueOptions').find('.checkbox_list input[type=checkbox]').closest('label').addClass('active');
		}
		else {
			$(this).closest('.selectAllVenueOptions').find('.checkbox_list input[type=checkbox]').prop('checked', false).trigger('change');
			$(this).closest('.selectAllVenueOptions').find('.checkbox_list input[type=checkbox]').closest('label').removeClass('active');
		}
	})

	$('.select_all').change(function(){
		if($(this).is(':checked') === true) {
			$(this).parent().next().find('input[type=checkbox]').prop('checked', true);
			$(this).parent().next().find('input[type=checkbox]').closest('label').addClass('active');
		}
		else {
			$(this).parent().next().find('input[type=checkbox]').prop('checked', false);
			$(this).parent().next().find('input[type=checkbox]').closest('label').removeClass('active');
		}
	})

	$('button.select_all').on('click', function(){
			$(this).next().prop('checked', !$(this).next().prop('checked'));
			if($(this).next().prop('checked') === false) {
				$(this).parent().next().find('input[type=checkbox]').prop('checked', false);
				$(this).parent().next().find('input[type=checkbox]').closest('label').removeClass('active');
			}else {
				$(this).parent().next().find('input[type=checkbox]').prop('checked', true);
				$(this).parent().next().find('input[type=checkbox]').closest('label').addClass('active');
			}

	})
	$('#venue-types_array label, #venue-vibes_array label, #venue-services_array label').each(function(){
		var flag=0;
		$(this).find('input').click(function(){
			if (flag==0){
				$(this).closest('label').addClass('active');
				flag=1;
			}
			else{
				flag=0;
				$(this).closest('label').removeClass('active');
			}
		});
	});

	$('.navigation_pos li a').click(function() {
		$('.navigation_pos li a').parent('li').removeClass('active');
		$(this).parent('li').addClass('active');
	});

	});



	$(window).resize(function(){
		openPanel();
		// leftPanelHeight();
		listMenu();
		//listResize();
		//list_resize();
	});
	/***/

	if ($.fn.modal !== undefined) {
		/* Fix for CKEditor in a Bootstrap Modal - http://jsfiddle.net/pvkovalev/4PACy/ */
		$.fn.modal.Constructor.prototype.enforceFocus = function () {
			var $modalElement = this.$element;
			$(document).on('focusin.modal', function (e) {
			var $parent = $(e.target.parentNode);
			if ($modalElement[0] !== e.target && !$modalElement.has(e.target).length
				// add whatever conditions you need here
				&&
				!$parent.hasClass('cke_dialog_ui_input_select') && !$parent.hasClass('cke_dialog_ui_input_text')) {
					$modalElement.focus();
				}
			});
		};

		/* Prevent Bootstrap Modal from disappearing when clicking outside or pressing escape */
		$.fn.modal.prototype.constructor.Constructor.DEFAULTS.backdrop = 'static';
		$.fn.modal.prototype.constructor.Constructor.DEFAULTS.keyboard = false;
	}

	if($('#agreement-editor1').length){
		CKEDITOR.replace('agreement-editor1');
	}
	if($('.editor_field').length){
		CKEDITOR.replace($(this).attr('id'));
	}


	$('.agreem-template').change(function(){
		var id = $(this).val();

		if(!confirm('Do you want to replace agreement content'))
			return;

		$.ajax({
			url: '/agreement-user/update?id=' + id,
			method: 'post',
			data:{
				org_id: $('.org_id').data('org_id')
			},
			dataType: 'json',
			success: function(data){
				if(data.status == 'error'){
					alert("thete"+data.msg);
				} else {
					location.reload()
				}
			},
			fail: function(data){
				alert('Error');
			}
		});
	});

	$('.agreement_template').on('change', function(){
		$.ajax({

			url: '/admin/template/get-agreement?id='+$(this).val(),

			dataType: 'json',

			error: function(jqXHR) {

				var message;

				if (jqXHR.status == 0) {

					message = ajaxTimeoutMessage;

				} else {

					message = jqXHR.responseText;

				}

				alert(message);

			},
			success: function (data) {
				var flag = true;
				if (CKEDITOR.instances.agreementtext.getData()) {
					if(!confirm('Do you want to replace the agreement content?')) {
						flag = false;
					}
				}
				if(flag == true) {
					CKEDITOR.instances.agreementtext.setData(data.text);
				}

			} 
		});
	})

	$('.notify-btn').click(function(){
		$.ajax({
			url: '/notification/mark-read',
			method: 'post',
			data:{},
			dataType: 'json',
			success: function(data){
				$('.count_new_notif').remove();
			},
			fail: function(data){
			}
		});
	})

	$('.left-adm-menu a').on('click', function(e){
        $('.left-adm-menu').find('a').removeClass('active-m');
        $(this).addClass('active-m');
	});

    $('[data-toggle="tooltip"]').tooltip({});

    var bankDetailsForm = function(){
        var self = this;

        var $triggersFields = {
            business: $('#organizationbankdetails-business_type'),
            country: $('#organizationbankdetails-country_id'),
            holder: $('#organizationbankdetails-holder_type'),
            bank_currency: $('.bank-currency-wrap select'),
        };

        var selectedValues = {
            business:0,
            country: 0,
            holder:0,
            bank_currency: ''
        };

        var $dynamicBlocks = {
            personal: $('.personal-one-info'),
            w9: $('.text-w9'),
            bussines: $('.bussines-block'),
            bank: $('.bank-info'),
            stripe: $('.stripe-info-wrap'),
            fein: $('.fein-text'),
            addressTitle: $('.address-title span'),
            stripeTooltip: $('.holder_type-sel i'),
            bankCurrencyTooltip: $('i.bank-currency')
        };

        this.triggers = function(){
            $triggersFields.business.on('change', function(){
                selectedValues.business = parseInt($(this).val());
                self.updateAll();
            });

            $triggersFields.country.on('change', function(){
                selectedValues.country = parseInt($(this).val());
                self.updateAll();
            });

            $triggersFields.holder.on('change', function(){
                selectedValues.holder = parseInt($(this).val());
                self.updateAll();
            });

            $triggersFields.bank_currency.on('change', function(){
                selectedValues.bank_currency = parseInt($(this).val());
				if(selectedValues.bank_currency === 1) {
					$dynamicBlocks.bankCurrencyTooltip.tooltip('show');
					setTimeout(function(){
						$dynamicBlocks.bankCurrencyTooltip.tooltip('hide');
					},8000);
				}
				else {
					$dynamicBlocks.bankCurrencyTooltip.tooltip('hide');
				}
            });
        };

        this.init = function(){
            $triggersFields.business.trigger('change');
            $triggersFields.country.trigger('change');
            $triggersFields.holder.trigger('change');
        };

        this.updateAll = function(){
            if(selectedValues.business === 0){
                $dynamicBlocks.personal.show();
                $dynamicBlocks.addressTitle.hide();
                $dynamicBlocks.bussines.hide();
                $dynamicBlocks.fein.hide();
                if(selectedValues.country === 233)$dynamicBlocks.w9.show();
                else $dynamicBlocks.w9.hide();
            } else if(isNaN(selectedValues.business)) {
                $dynamicBlocks.w9.hide();
                $dynamicBlocks.personal.hide();
                $dynamicBlocks.bussines.hide();
                $dynamicBlocks.fein.hide();
            } else if(selectedValues.business === 1) {
                $dynamicBlocks.w9.hide();
                $dynamicBlocks.personal.hide();
                $dynamicBlocks.addressTitle.show();
                $dynamicBlocks.bussines.show();
                if(selectedValues.country === 233)$dynamicBlocks.fein.show();
                else $dynamicBlocks.fein.hide();
            }

            if(selectedValues.holder === 1){
                $dynamicBlocks.stripeTooltip.tooltip('hide');
                $dynamicBlocks.bank.hide();
                $dynamicBlocks.stripe.show();
            } else {
                $dynamicBlocks.bank.show();
                $dynamicBlocks.stripe.hide();
                $dynamicBlocks.stripeTooltip.tooltip('show');
                setTimeout(function(){
                    $dynamicBlocks.stripeTooltip.tooltip('hide');
                },5000);
            }
        };

        self.triggers();
        self.init();
        self.updateAll();
    };

    if($('.bank-details').length){
        var BankDetailsForm = new bankDetailsForm();
    }

//	$('.top-search-form').on('submit', function(e) {
	$('body').on('beforeSubmit', '.top-search-form', function() {
//		e.preventDefault();
		$('#top-search-error').hide();
		var $form = $(this);
		var data = $form.data('yiiActiveForm');
		$.each(data.attributes, function() {
			this.status = 3;
		});
		$form.yiiActiveForm('validate');
		if ($('.has-error', this).length) {
			return false;
		}
		$('#top-search-loading').show();
		$('#top-search-content').hide();
		$.ajax({
			url: $form.attr('action'),
			method: 'GET',
			data: $form.serialize(),
			context: this,
			timeout: ajaxTimeout,
			complete: function () {
				$('#top-search-loading').hide();
			},
			error: function(jqXHR) {
				var message;
				if (jqXHR.status == 0) {
					message = ajaxTimeoutMessage;
				} else {
					message = jqXHR.responseText;
				}
				$('#top-search-error .alert-danger').html(message);
				$('#top-search-error').show();
			},
			success: function(data) {
				if (data.errors !== undefined && !$.isEmptyObject(data.errors)) {

					$.each(data.errors, function(key, val) {
						$('.field-' + key).addClass('has-error');
						$('.field-' + key + ' .help-block').html(val);
					});
				} else {
					$('#top-search-content').html(data.content).show();
				}
			}
		});
	});

	$('body').on('submit', '.top-search-form', function(e) {
		e.preventDefault();
	});

    // var venueTabelAvailabilityScroll = function(){
    //     this.init = function(){
    //         $('table.availability_table').stickyTableHeaders({
    //             fixedOffset: 120,
    //             //scrollableArea: $('#adm-content-block')
    //         });
    //     };
    //     this.setVerticalMemoryScroll = function(){
    //         var venCalendScroll = getCookie('ven_calend_scroll');
    //         if(venCalendScroll.length){
    //             document.getElementById('adm-content-block').scrollTop = parseInt(venCalendScroll);
    //         }
    //     };
    //     this.onscrollEvent = function(){
    //         document.getElementById('adm-content-block').onscroll = function(){
    //             var self = this;
    //             var rememberVerticalScroll = function (){
    //                 var currentScroll = self.scrollTop.toFixed();
    //                 setCookie('ven_calend_scroll', currentScroll);
    //             };
    //             var fixHorizontalHeaderScroll = function (){
    //                 var scrollLeft = self.scrollLeft.toFixed();
    //                 if(scrollLeft){
    //                     $('.tableFloatingHeaderOriginal').css({ 'margin-left': -scrollLeft });
    //                     //checkScroll();
    //                 }
    //             };
    //             rememberVerticalScroll();
    //             fixHorizontalHeaderScroll();
    //         };

    //     };
    //     function checkScroll(){
    //         t = setTimeout(function(){
    //             $('table.availability_table').trigger('resize.stickyTableHeaders');
    //         },100);
    //     }
    //     this.init();
    //     this.setVerticalMemoryScroll();
    //     this.onscrollEvent();
    // };
    // if($('table.availability_table').length){
    //     venueTabelAvailabilityScroll();
    // }

    /* scripts for dashboard widgets*/

	if($(".widget-section").length){
		$(".widget-section" ).sortable({
			connectWith: ".widget-section",
			handle: ".ido-panel-header",
			cancel: ".ido-panel-toggle",
			// scroll: false,
			placeholder: "ido-panel-placeholder ui-corner-all",
			update: function(event, ui) {
				var index = $('.ido-panel', this).index(ui.item);
				if (index < 0) return;
				console.log('Save new positions and orders');
				dashboardWidgetsSaveGroupedByPosition();
			},
            start: function(e, ui) {

				ui.item.find( ".ido-panel-body").hide();
                ui.item.css('height','150px');
                ui.item.css('width','300px');

            },
            stop: function(event, ui) {
                ui.item.find( ".ido-panel-body" ).show();
                ui.item.css('height','auto');
                ui.item.css('width','auto');
            }
		});
	}

    var dashboardWidgetsSaveGroupedByPosition = function() {
	var data = {};
	$('.widget-section').each(function(key, section) {
		var position = $(section).attr('data-position');
		data[position] = [];
		$('.ido-panel', section).each(function(key, widget) {
			data[position].push($(widget).attr('data-widget'));
		});
	});
	console.log(data);
	$.ajax({
		url: dashboardSectionsSaveGroupedByPositionUrl,
		method: 'POST',
//		timeout: ajaxTimeout,
		data: {
			sections: data
		},
//		context: this,
//		complete: function() {
//		},
//		error: function(jqXHR) {
//			var message;
//			if (jqXHR.status == 0) {
//				message = ajaxTimeoutMessage;
//			} else if (jqXHR.status == 302) {
//				return;
//			} else {
//				message = jqXHR.responseText;
//			}
//			Snackbar({text: message, type: 'danger'});
//		},
//		success: function(data) {
//		}
	});
    }

    var dashboardWidgetsSaveDisplayed = function() {
	var data = [];
	$('.ido-panel:visible').each(function(key, widget) {
		data.push($(widget).attr('data-widget'));
	});
	console.log(data);
	$.ajax({
		url: dashboardSectionsSaveDisplayedUrl,
		method: 'POST',
//		timeout: ajaxTimeout,
		data: {
			sections: data
		},
//		context: this,
//		complete: function() {
//		},
//		error: function(jqXHR) {
//			var message;
//			if (jqXHR.status == 0) {
//				message = ajaxTimeoutMessage;
//			} else if (jqXHR.status == 302) {
//				return;
//			} else {
//				message = jqXHR.responseText;
//			}
//			Snackbar({text: message, type: 'danger'});
//		},
//		success: function(data) {
//		}
	});
    }

    $( ".ido-panel" )
        .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
        .find( ".ido-panel-header" )
        .addClass( "ui-widget-header ui-corner-all" )


    $(".remove-panel-btn").on("click", function(){
    	if(!$(this).closest('.disabled_form')) {
	    	$(this).closest(".ido-panel").css('display','none');
			dashboardWidgetsSaveDisplayed();
		}
    });


    // $( ".ido-panel-header" ).on( "mousedown", function(e) {
    //     if(e.which==1)
    //         $(this).parent().find( ".ido-panel-body").css('display','none');
    // });
    // $( ".ido-panel-header" ).on( "mouseup", function() {
    //     $(this).parent().find( ".ido-panel-body" ).css('display','');
    // });

	// $( ".panel-move-toggle" ).on( "mousedown", function(e) {
	// 	if(e.which==1)
	// 		$(this).closest( ".ido-panel" ).find( ".ido-panel-body").css('display','none');
	// });
	// $( ".panel-move-toggle" ).on( "mouseup", function() {
	// 	$(this).closest( ".ido-panel" ).find( ".ido-panel-body" ).css('display','');
	// });
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setSectionSubtitle(text) {
    $('#subtitle').html(text);
}

function setBrowserTitle(text) {
    $('title').html(text);
}

function getSectionTitle() {
    return $('#section_title').html();
}

function getSectionSubtitle() {
    return $('#subtitle').html();
}
