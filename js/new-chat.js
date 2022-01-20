$(document).ready(function() {

  $('.setting-menu-chat .btn-cancel').click(function() {
      $(".setting-menu-chat").hide();
  });

  $('.settings-btn').click(function() {
      $(".setting-menu-chat").show();
      $(this).parent().addClass('active');
  });

  $('.ido-new-chat .close').click(function() {
      $(".ido-new-chat").hide();
      $(".ido-new-chat-open").show();
      $('.settings-btn').parent().removeClass('active')
  });

  $('.ido-new-chat-open').click(function() {
      $(".ido-new-chat").show();
      $(this).hide();
  });

  $('#open-welcome').click(function() {
      $(".right-section .welcome").show();
      $(".right-section .active").hide();
  });
  $('#close-welcome').click(function() {
      $(".right-section .welcome").hide();
      $(".right-section .active").show();
  });
});

