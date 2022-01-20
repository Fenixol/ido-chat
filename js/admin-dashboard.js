$('.filter_assigned').on('click', function(){
	$(this).closest('form').submit();	
})
$('.event_filter').on('change', function(){
	$(this).closest('form').submit();
})