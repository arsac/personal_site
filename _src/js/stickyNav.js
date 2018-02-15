'use strict';

import $ from 'jquery';

import { MediaQuery } from 'foundation-sites/js/foundation.util.mediaQuery';
import { Triggers } from 'foundation-sites/js/foundation.util.triggers';
import { Sticky } from 'foundation-sites/js/foundation.sticky';


class StickyNav extends Sticky {

    _setup(element, options) {
        this.$element = element;
        this.options = $.extend({}, StickyNav.defaults, this.$element.data(), options);
        this.className = 'StickyNav'; // ie9 back compat

        // Triggers init is idempotent, just need to make sure it is initialized
        Triggers.init($);

        this._init();

    }

    _init() {
        this.isStuckMiddle = false;
        if(this.options.$middleAnchor) {
            this.$middleAnchor = this.options.$middleAnchor;
        }
        super._init();
    }

    _setStickyMiddle() {
        this.isStuckMiddle = true;
        this.$element.addClass('stuck-middle');
    }
    _removeStickyMiddle() {
        this.isStuckMiddle = false;
        this.$element.removeClass('stuck-middle');
    }

    _setBreakPoints(elemHeight, cb) {
        super._setBreakPoints(elemHeight, cb);
        this.middlePoint = this.$middleAnchor.offset().top;
    }

    _setSizes(cb) {
        this.canStick = MediaQuery.is(this.options.stickyOn);
        if (!this.canStick) {
            if (cb && typeof cb === 'function') { cb(); }
        }
        var _this = this,
            newElemWidth = this.$container[0].getBoundingClientRect().width,
            comp = window.getComputedStyle(this.$container[0]),
            pdngl = parseInt(comp['padding-left'], 10),
            pdngr = parseInt(comp['padding-right'], 10);

        if (this.$anchor && this.$anchor.length) {
            this.anchorHeight = this.$anchor[0].getBoundingClientRect().height;
        } else {
            this._parsePoints();
        }

        this.$element.css({
            'max-width': `${newElemWidth - pdngl - pdngr}px`
        });

        var newContainerHeight = this.$element[0].getBoundingClientRect().height || this.containerHeight;
        if (this.$element.css("display") == "none") {
            newContainerHeight = 0;
        }

        if(!this.isStuckMiddle) {
            this.containerHeight = newContainerHeight;
            this.$container.css({
                height: newContainerHeight
            });
        }

        this.elemHeight = newContainerHeight;

        if (!this.isStuck) {
            if (this.$element.hasClass('is-at-bottom')) {
                var anchorPt = (this.points ? this.points[1] - this.$container.offset().top : this.anchorHeight) - this.elemHeight;
                this.$element.css('top', anchorPt);
            }
        }

        this._setBreakPoints(newContainerHeight, function() {
            if (cb && typeof cb === 'function') { cb(); }
        });
    }

    _calc(checkSizes, scroll) {
        if (checkSizes) { this._setSizes(); }

        if (!this.canStick) {
            if (this.isStuck) {
                this._removeSticky(true);
                this._removeStickyMiddle();
            }
            return false;
        }

        if (!scroll) { scroll = window.pageYOffset; }

        if (scroll >= this.topPoint) {
            if (scroll <= this.bottomPoint) {
                if(scroll >= this.middlePoint && !this.isStuckMiddle) {
                    this._setStickyMiddle();
                }

                if(this.isStuckMiddle && scroll < this.middlePoint) {
                    this._removeStickyMiddle();
                }

                if (!this.isStuck) {
                    this._setSticky();
                }
            } else {
                if (this.isStuck) {
                    this._removeSticky(false);
                }
            }
        } else {
            if (this.isStuck) {
                this._removeSticky(true);
            }
        }
    }
}

export {StickyNav};
