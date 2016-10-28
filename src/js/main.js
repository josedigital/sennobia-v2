$(document).ready(function() {

//add some smooth for scroll
  $('.Top-navigation a').on('click', function() {
    $(window).stop(true).scrollTo(this.hash, {duration:1000, interrupt:true});
    return false;
  });
  $('.js-scroll-button').on('click', function() {
    $(window).stop(true).scrollTo(this.hash, {duration:1000, interrupt:true});
    return false;
  });

  var $store = $('.Store');
  var storeTop = $store.offset().top;
  $(window).scroll(function() {
    if ( $(window).scrollTop() >= storeTop ) {
      $('.Navigation a').addClass('dark');
    } else {
      $('.Navigation a').removeClass('dark');
    }
  });


// Hide Header on on scroll down
// var didScroll;
// var lastScrollTop = 0;
// var delta = 5;
// var navbarHeight = $('header').outerHeight();

// $(window).scroll(function(event){
//     didScroll = true;
// });

// setInterval(function() {
//     if (didScroll) {
//       hasScrolled();
//       didScroll = false;
//     }
// }, 250);

// function hasScrolled() {
//     var st = $(this).scrollTop();

//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta)
//         return;

//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         $('header').removeClass('nav-down').addClass('nav-up');
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             $('header').removeClass('nav-up').addClass('nav-down');
//         }
//     }

//     lastScrollTop = st;
// }




// process the form
    $('form').submit(function(event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'Name'              : $('input[name=name]').val(),
            'Email Address'     : $('input[name=_replyto]').val(),
            'Comment'           : $('input[name=comments]').val(),
            'Would like a free trial'         : $('input[name=freetrial').val()
        };

        $(this).addClass('fade-out');

        // process the form
        $.ajax({
            method      : 'POST',
            url         : 'https://formspree.io/info@sennobia.com', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json' // what type of data do we expect back from the server
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data);

                $('input, textarea').val('');
                $('form').remove();
                $('.Contact__message-received').addClass('fade-in');

                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });




});
