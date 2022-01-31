$(document).ready(function() {

  $('.setting-menu-chat .btn-cancel').click(function() {
      $(".setting-menu-chat").hide();
      $('.settings-btn').parent().removeClass('active')
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

  $('#chats-tab').click(function() {
      $(".right-section .welcome").show();
      $(".right-section .active").hide();
  });
  $('#contacts-tab').click(function() {
      $(".right-section .welcome").hide();
      $(".right-section .active").show();
  });

  $("#contacts").chosen({
    disable_search: true
  });
  $("#locations").chosen({
  });
  $("#vendor_type").chosen({
    disable_search: true
  });

  $("#search-new-chat").keyup(function() {
    $('.clear_search').show();
  });

  $(".clear_search").click(function() {
    $(this).hide();
    $("#search-new-chat").val('');
  });

  $('#home').mCustomScrollbar({
    theme: 'dark',
  });


  /* Functions for ido-context-menu */

  /**
   * Function to check if we clicked inside an element with a particular class
   * name.
   * 
   * @param {Object} e The event
   * @param {String} className The class name to check against
   * @return {Boolean}
   */
   function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }

  /**
   * Get's exact position of event.
   * 
   * @param {Object} e The event passed in
   * @return {Object} Returns the x and y position
   */
  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // C O R E    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  
  /**
   * Variables.
   */
  var contextMenuClassName = "chat-context-menu";
  var contextMenuItemClassName = "chat-context-menu__item";
  var contextMenuLinkClassName = "chat-context-menu__link";
  var contextMenuActive = "chat-context-menu--active";

  var taskItemClassName = "ido-newchat-list";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#chat-context-menu");
  var menuItems = menu.querySelectorAll(".chat-context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  /**
   * Initialise our application's code.
   */
  function init() {

    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  function contextListener() {

    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );
      taskItemInContext1 = clickInsideElement( e, 'attach-block' );
      if(taskItemInContext1){
        menu = document.querySelector("#chat-context-file-menu");
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else if ( taskItemInContext ) {
        menu = document.querySelector("#chat-context-menu");
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );
      taskItemInContext1 = clickInsideElement( e, 'attach-block' );
      if(taskItemInContext1){
        menu = document.querySelector("#chat-context-file-menu");
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      }
      else if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
   * Positions the menu properly.
   * 
   * @param {Object} e The event
   */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   * 
   * @param {HTMLElement} link The link that was clicked
   */
  function menuItemListener( link ) {
    console.log( "Task ID - " + taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
    toggleMenuOff();
  }

  /**
   * Run the app.
   */
  init();

});

