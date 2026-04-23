$(document).on("mobileinit", function () {
    // Configure JQM Defaults
    $.mobile.defaultPageTransition = "slide";
    $.mobile.loader.prototype.options.text = "Loading...";
    $.mobile.loader.prototype.options.textVisible = true;
    $.mobile.loader.prototype.options.theme = "b";
});

// Re-trigger animations when a page is shown
$(document).on("pageshow", function(event, ui) {
    var $page = $(event.target);
    
    // Quick hack to re-trigger CSS animations on page view
    $page.find('.fade-in').removeClass('fade-in').voidWidth; 
    $page.find('.fade-in').addClass('fade-in');
});

// Contact Form Submit Handler (Mock)
$(document).on("pagecreate", "#contact", function() {
    $("#contactForm").on("submit", function(e) {
        e.preventDefault(); // Prevent actual submission
        
        // Simple UI feedback
        var btn = $(this).find('button[type="submit"]');
        var originalText = btn.text();
        
        btn.text('Message Sent!').css('background-color', '#10b981');
        
        setTimeout(function() {
            $('#contactForm')[0].reset();
            btn.text(originalText).css('background-color', '');
        }, 3000);
    });
});
