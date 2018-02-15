import $ from 'jquery';

window.jQuery = $;
window.$ = $;


import { Touch } from 'foundation-sites/js/foundation.util.touch';
import { Triggers } from 'foundation-sites/js/foundation.util.triggers';
import { SmoothScroll } from 'foundation-sites/js/foundation.smoothScroll';
import { Sticky } from 'foundation-sites/js/foundation.sticky';
import { Foundation } from 'foundation-sites/js/foundation.core';
import { Tooltip } from 'foundation-sites/js/foundation.tooltip';
import { Box } from 'foundation-sites/js/foundation.util.box';
import { Magellan } from 'foundation-sites/js/foundation.magellan';

import { StickyNav } from './stickyNav';

Foundation.addToJquery($);

Foundation.Box = Box;
Foundation.Magellan = Magellan;
Foundation.Sticky = Sticky;
Foundation.StickyNav = StickyNav;

Triggers.init($, Foundation);
Touch.init($);
Foundation.plugin(Magellan, 'Magellan');
Foundation.plugin(SmoothScroll, 'SmoothScroll');
Foundation.plugin(Sticky, 'Sticky');
Foundation.plugin(StickyNav, 'StickyNav')

var $main, $style, addModalBackdropStyle, onScroll, ready, scrollDiff;

$main = null;

$style = null;

scrollDiff = function() {
    var st, wt;
    wt = $main.position().top;
    st = $(window).scrollTop();
    return {
        pos: wt - st,
        wt: wt,
        st: st
    };
};

onScroll = function() {
    var distance, opacity, pos, sd;
    sd = scrollDiff();
    pos = sd.pos;
    if (sd.pos <= 0) {
        $('body').addClass("scrolled");
    } else {
        distance = sd.st / Math.abs(sd.wt);
        opacity = 1 - distance;
        $('#bg-wrapper').css("opacity", opacity);
    }
    return $('#scroll-to-main').toggleClass("hidden", sd.st !== 0);
};

addModalBackdropStyle = function(color) {
    if ($style) {
        $style.remove();
    }
    $style = $("<style>.portfolio .modal-backdrop { background-color: #" + color + "; }</style>");
    return $style.appendTo(document.documentElement);
};

ready = function() {
    var count, wait;
    wait = 0;
    count = 0;

    var stickyHeader = new StickyNav($('#header'), {
        marginTop: 0,
        $middleAnchor: $('.page-content')
    });
    var $hero = $('#hero');
    var heroTimeout;
    $(window).on('scroll', function(){
        var heroOffetTop = $hero.offset().top;

        clearTimeout(heroTimeout);
        if(heroOffetTop - 100 <= this.pageYOffset) {
            heroTimeout = setTimeout(function() {
                $hero.addClass('off');
            }, 10);
        } else {
            heroTimeout = setTimeout(function() {
                $hero.removeClass('off');
            }, 10);
        }
    });

    $(window).on( 'load', function() {
        $('body.home').addClass('in');
        return $('.portfolio .project .fade').each(function() {
            var $t;
            $t = $(this);
            setTimeout(function() {
                return $t.addClass('in');
            }, wait);
            if (count % 2 === 0) {
                wait += 80;
            }
            return count += 1;
        });
    });

};

$(document).ready(ready);
$(document).on('page:load', ready);

if(console && typeof console.log === 'function') {
    console.log(`%c    ,-----.    .---.  .---.         .---.  .---..-./\`)          ________ .-------.   .-./\`)     .-''-.  ,---.   .--. ______      
  .'  .-,  '.  |   |  |_ _|         |   |  |_ _|\\ .-.')        |        ||  _ _   \\  \\ .-.')  .'_ _   \\ |    \\  |  ||    _ \`''.  
 / ,-.|  \\ _ \\ |   |  ( ' )         |   |  ( ' )/ \`-' \\        |   .----'| ( ' )  |  / \`-' \\ / ( \` )   '|  ,  \\ |  || _ | ) _  \\ 
;  \\  '_ /  | :|   '-(_{;}_)        |   '-(_{;}_)\`-'\`"\`        |  _|____ |(_ o _) /   \`-'\`"\`. (_ o _)  ||  |\\_ \\|  ||( ''_'  ) | 
|  _\`,/ \\ _/  ||      (_,_)         |      (_,_) .---.         |_( )_   || (_,_).' __ .---. |  (_,_)___||  _( )_\\  || . (_) \`. | 
: (  '\\_/ \\   ;| _ _--.   |         | _ _--.   | |   |         (_ o._)__||  |\\ \\  |  ||   | '  \\   .---.| (_ o _)  ||(_    ._) ' 
 \\ \`"/  \\  ) / |( ' ) |   |         |( ' ) |   | |   |         |(_,_)    |  | \\ \`'   /|   |  \\  \`-'    /|  (_,_)\\  ||  (_.\\.' /  
  '. \\_/\`\`".'  (_{;}_)|   |         (_{;}_)|   | |   |         |   |     |  |  \\    / |   |   \\       / |  |    |  ||       .'   
    '-----'    '(_,_) '---'         '(_,_) '---' '---'         '---'     ''-'   \`'-'  '---'    \`'-..-'  '--'    '--''-----'\`     
                                                                                                                                 `, "font-family:monospace");
}
