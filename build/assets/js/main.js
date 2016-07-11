/*!
*
*  Copyright (c) David Bushell | http://dbushell.com/
*
*/
(function(win, doc) {

  /* fake links */
  // $(document).on('click', '[data-href]', function(e)
  // {
  //     var t = e.target;
  //     if (t && t.nodeType === 1 && t.nodeName.toLowerCase() === 'a') {
  //         return;
  //     }
  //     window.location.href = $(e.currentTarget).data('href');
  // });

  /* SVG > PNG fallback */
  // if (!window.Modernizr.svg) {
  //     $('img[src$=".svg"]').attr('src', function() {
  //         return $(this).attr('src').replace(/\.svg$/, '.png');
  //     });
  // }

})(window, document);
