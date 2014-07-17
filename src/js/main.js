/*!
 *
 *  Copyright (c) David Bushell | http://dbushell.com/
 *
 */
(function(window, document, undefined)
{

    var hasEventListeners = !!window.addEventListener,

        addEvent = function(el, e, callback, capture)
        {
            if (hasEventListeners) {
                el.addEventListener(e, callback, !!capture);
            } else {
                el.attachEvent('on' + e, callback);
            }
        },

        removeEvent = function(el, e, callback, capture)
        {
            if (hasEventListeners) {
                el.removeEventListener(e, callback, !!capture);
            } else {
                el.detachEvent('on' + e, callback);
            }
        },

        fireEvent = function(el, eventName, data)
        {
            var ev;

            if (document.createEvent) {
                ev = document.createEvent('HTMLEvents');
                ev.initEvent(eventName, true, false);
                ev = extend(ev, data);
                el.dispatchEvent(ev);
            } else if (document.createEventObject) {
                ev = document.createEventObject();
                ev = extend(ev, data);
                el.fireEvent('on' + eventName, ev);
            }
        },

        trim = function(str)
        {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
        },

        hasClass = function(el, cn)
        {
            return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
        },

        addClass = function(el, cn)
        {
            if (!hasClass(el, cn)) {
                el.className = (el.className === '') ? cn : el.className + ' ' + cn;
            }
        },

        removeClass = function(el, cn)
        {
            el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
        };


    var transformProp  = window.Modernizr.prefixed('transform'),
        transitionProp = window.Modernizr.prefixed('transition'),
        transitionEnd  = (function() {
            var props = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            return props.hasOwnProperty(transitionProp) ? props[transitionProp] : false;
        })();


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


    window.App = (function()
    {

        var _init = 0, app = { };

        var $win   = window,
            $docEl = document.documentElement;

        app.init = function()
        {
            if (_init++) {
                return;
            }

            app.initNavigation();
        };

        if ($win.addEventListener) {
            $win.addEventListener('DOMContentLoaded', app.init, false);
        } else if ($win.attachEvent) {
            $win.attachEvent('onload', function(e) { app.init(); });
        }

        app.initNavigation = function()
        {

            app.isNavOpen = false;

            var $nav     = document.getElementById('nav'),
                $overlay = document.getElementById('overlay');

            app.openNav = function()
            {
                app.isNavOpen = true;
                addClass($nav, 'nav--active');
                addClass($overlay, 'overlay--active');
            };

            app.closeNav = function()
            {
                app.isNavOpen = false;
                removeClass($nav, 'nav--active');
                removeClass($overlay, 'overlay--active');
            };

            addEvent(document.getElementById('nav-open'), 'click', function(e)
            {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
                app.openNav();
            },
            false);

            addEvent(document.getElementById('nav-close'), 'click', function(e)
            {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
                app.closeNav();
            },
            false);

            addEvent(document.getElementById('overlay'), 'click', app.closeNav, false);

            addEvent(window, 'keydown', function(e)
            {
                if (e.which === 27) {
                    setTimeout(function() {
                        if (app.isNavOpen) app.closeNav();
                    }, 50);
                }
            }, false);

        };

        return app;

    })();

})(window, window.document);
