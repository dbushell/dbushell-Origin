/*!
 *
 *  Copyright (c) David Bushell | @dbushell | http://dbushell.com/
 *
 */
(function(window, document, undefined)
{
    'use strict';

    var console = window.console;
    if (typeof console !== 'object' || !console.log)
    {
        (function() {
            var noop    = function() {},
                methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
                length  = methods.length;
            console = {};
            while (length--) {
                console[methods[length]] = noop;
            }
        }());
    }

    /*!
     * fix responsive grids for no-boxsizing browsers
     * http://dbushell.com/2013/03/19/on-responsive-layout-and-grids/
     * http://dbushell.com/2012/03/27/introducing-shiro/
     */
    (function() {

        if (!Modernizr.boxsizing) {

            var i, gs = [], len, all, inner;

            // get all grid blocks ...
            if (typeof document.getElementsByClassName === 'function') {
                all = document.getElementsByClassName('gc');
                if (typeof all.item !== undefined) {
                    len = all.length;
                    for (i = 0; i < len; i++) gs[i] = all[i];
                } else {
                    gs = all;
                }
            // ... try again the slower way
            } else {
                all = document.getElementsByTagName('*');
                len = all.length;
                for (i = 0; i < len; i++) {
                    var cn = ' ' + all[i].className + ' ';
                    if (cn.indexOf(' gc ') !== -1) {
                        gs.push(all[i]);
                    }
                }
            }
            // do an inner wrap to hold the padding
            len = gs.length;
            for (i = 0; i < len; i++) {
                inner = gs[i];
                var parent = inner.parentNode,
                    outer = document.createElement('div');
                outer.className = inner.className;
                inner.className = 'gc-body';
                parent.insertBefore(outer, inner);
                outer.appendChild(inner);
            }
        }

    }());

    // var trim = function(str)
    // {
    //     return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    // };

    // var hasClass = function(el, cn)
    // {
    //     return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    // };

    // var addClass = function(el, cn)
    // {
    //     if (!hasClass(el, cn)) {
    //         el.className = (el.className === '') ? cn : el.className + ' ' + cn;
    //     }
    // };

    // var removeClass = function(el, cn)
    // {
    //     el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    // };

    // var hasParent = function(el, id)
    // {
    //     if (el) {
    //         do {
    //             if (el.id === id) {
    //                 return true;
    //             }
    //             if (el.nodeType === 9) {
    //                 break;
    //             }
    //         }
    //         while((el = el.parentNode));
    //     }
    //     return false;
    // };

    var doc = document.documentElement;

    var transform_prop = window.Modernizr.prefixed('transform'),
        transition_prop = window.Modernizr.prefixed('transition'),
        transition_end = (function() {
            var props = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
        })();


    window.App = (function()
    {

        var _init = 0, app = { };

        app.init = function()
        {
            if (_init++) {
                return;
            }

            /*!
             * Implementing Off-Canvas Navigation For A Responsive Website
             * coding.smashingmagazine.com/2013/01/15/off-canvas-navigation-for-responsive-website/
             * https://github.com/dbushell/Responsive-Off-Canvas-Menu/
             */

            // var inner = document.getElementById('inner-wrap'),
            //     nav_open = false,
            //     nav_class = 'js-nav';

            // var closeNavEnd = function(e)
            // {
            //     if (e && e.target === inner) {
            //         document.removeEventListener(transition_end, closeNavEnd, false);
            //     }
            //     nav_open = false;
            // };

            // app.closeNav =function()
            // {
            //     if (nav_open) {
            //         // close navigation after transition or immediately
            //         var duration = (transition_end && transition_prop) ? parseFloat(window.getComputedStyle(inner, '')[transition_prop + 'Duration']) : 0;
            //         if (duration > 0) {
            //             document.addEventListener(transition_end, closeNavEnd, false);
            //         } else {
            //             closeNavEnd(null);
            //         }
            //     }
            //     removeClass(doc, nav_class);
            // };

            // app.openNav = function()
            // {
            //     if (nav_open) {
            //         return;
            //     }
            //     addClass(doc, nav_class);
            //     nav_open = true;
            // };

            // app.toggleNav = function(e)
            // {
            //     if (nav_open && hasClass(doc, nav_class)) {
            //         app.closeNav();
            //     } else {
            //         app.openNav();
            //     }
            //     if (e) {
            //         e.preventDefault();
            //     }
            // };

            // document.getElementById('nav-jump').addEventListener('click', app.toggleNav, false);

            // document.getElementById('nav-return').addEventListener('click', app.toggleNav, false);

            // // close nav by touching the partial off-screen content
            // document.addEventListener('click', function(e)
            // {
            //     if (nav_open && !hasParent(e.target, 'nav')) {
            //         e.preventDefault();
            //         app.closeNav();
            //     }
            // },
            // true);

            // addClass(doc, 'js-ready');
        };

        return app;

    })();

})(window, window.document);
