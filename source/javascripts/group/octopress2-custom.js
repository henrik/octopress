// This file must have a name that comes after "jquery" alphabetically, due to how minification works.

// Make the year headers on the index/tag pages position: fixed sometimes, like iOS table headers.
//
// FIXME:
// * Doesn't properly reset on resizing.

$(function() {
  // Scroll events are funky with touch. Let's not even go there.
  var isTouchDevice = 'ontouchstart' in document.documentElement;
  if (isTouchDevice) return;

  var $container = $("#blog-archives");
  var $headers = $container.find("h2");
  var originalPosition = $headers.css("position");
  var originalTop = $headers.css("top");
  var headerHeight;
  var headerOffsets;
  var lastHeader;
  var containerBottom;

  $(document).scroll(moveHeaders);
  $(window).resize(setUp);
  setUp();

  // Any time the window resizes, we must recalculate the things that change,
  // and re-evaluate what header should be fixed.
  function setUp() {
    headerHeight = $headers.height();
    containerBottom = $container.offset().top + $container.height() - headerHeight;
    headerOffsets = $headers.map(function() {
      return { header: this, offset: $(this).offset().top };
    });
    moveHeaders();
  }

  function headerForX(x) {
    var thisHeader;
    var nextOffset;
    headerOffsets.each(function() {
      if (this.offset < x) {
        thisHeader = this.header;
      } else {
        nextOffset = nextOffset || this.offset;
      }
    });

    if (thisHeader) {
      nextOffset = nextOffset || containerBottom;
      thisHeader.nextOffset = nextOffset;
    }

    return thisHeader;
  }

  function moveHeaders() {
    var pos = $(document).scrollTop();
    var header = headerForX(pos);

    if (lastHeader && lastHeader != header) {
      $(lastHeader).css({ position: originalPosition, top: originalTop, opacity: 1.0 });
      lastHeader = null;
    }

    if (header) {
      var opacity = 1.0;
      var fullAt = header.nextOffset - headerHeight;
      if (pos > fullAt) {
        opacity = 1 - (pos - fullAt) / headerHeight;
      }

      $(header).css({ position: "fixed", top: 0, opacity: opacity });
      lastHeader = header;
    }
  }
});
