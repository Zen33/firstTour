/*
 * Plugin name: First Tour
 * Date:        07/14/2013
 * Ver:         0.2 alphal
 * Author:      tangzhen@me.com
 * Based on jQuery library
 * Update:     07/15/2013 Introduce Chinese annotation
 *             07/16/2013 Customize the position for tour
 */
var firstTour = firstTour || {};

firstTour.guide = (function () { // 初始化设置 element：绑定向导元素；hint：提示信息；position：提示位置
    var tourItems = [{
        element: '',
        hint: '',
        position: ''
    }, {
        element: '',
        hint: '',
        position: {
            top: 100,
            left: 100
        }
    }],
        GUIDER = 'tour', // 提示气泡id
        ARROW_HEIGHT = 20, // 提示气泡箭头高度
        TIMER = 600, // 延迟显示时长
        current = 0; // 当前向导帧
    arrIDs = []; // 向导元素数组

    function _initTour() { // 初始化
        jQuery.each(tourItems, function () {
            jQuery('#' + this.element).addClass(GUIDER);
            arrIDs.push(this.element);
        });
        if (window.addEventListener) {
            window.addEventListener('click', _ctrFlow, true);
        } else if (document.attachEvent) { // IE
            document.attachEvent('click', _ctrFlow);
        }
        _showTour(0);
    }

    function _(id) { // 返回当前元素标签
        return document.getElementById(id);
    }

    function _key(arr, val) { // 通过值查找对应key
        for (var prop in arr) {
            if (arr.hasOwnProperty(prop)) {
                if (arr[prop] === val) return (+prop + 1);
            }
        }
    }

    function _ctrFlow(e) { // 流程控制
        if (jQuery(e.target).closest('.' + GUIDER).length) {
            var index = _key(arrIDs, jQuery(e.target).closest('.' + GUIDER)[0].getAttribute('id'));
            if (current != index) _(GUIDER).style.display = 'none';
            setTimeout(function () {
                _showTour(index);
            }, TIMER);
        } else {
            _exitTour();
        }
    }

    function _showTour(index) { // 显示向导气泡
        if (!(index in tourItems)) {
            _exitTour();
        } else {
            var $tourItem = jQuery('#' + tourItems[index].element);
            switch (tourItems[index].position) {
            case 'top':
                _(GUIDER).setAttribute('class', 'top');
                _(GUIDER).style.left = $tourItem.offset().left + 'px';
                _(GUIDER).style.top = ($tourItem.offset().top - jQuery('#' + GUIDER).height() - ARROW_HEIGHT) + 'px';
                break;
            case 'right':
                _(GUIDER).setAttribute('class', 'right');
                _(GUIDER).style.left = ($tourItem.offset().left + $tourItem.width() + ARROW_HEIGHT) + 'px';
                _(GUIDER).style.top = $tourItem.offset().top + 'px';
                break;
            case 'left':
                _(GUIDER).setAttribute('class', 'left');
                _(GUIDER).style.left = ($tourItem.offset().left - jQuery('#' + GUIDER).width() - ARROW_HEIGHT) + 'px';
                _(GUIDER).style.top = $tourItem.offset().top + 'px';
                break;
            case 'bottom':
                _(GUIDER).setAttribute('class', 'bottom');
                _(GUIDER).style.left = $tourItem.offset().left + 'px';
                _(GUIDER).style.top = ($tourItem.offset().top + $tourItem.height() + ARROW_HEIGHT) + 'px';
                break;
            default:
                _(GUIDER).setAttribute('class', 'right');
                _(GUIDER).style.left = tourItems[index].position.left + 'px';
                _(GUIDER).style.top = tourItems[index].position.top + 'px';
                break;
            }
            if (parseInt(_(GUIDER).style.left) < 0) _(GUIDER).style.left = ARROW_HEIGHT + 'px';
            if (parseInt(_(GUIDER).style.top) < 0) _(GUIDER).style.top = ARROW_HEIGHT + 'px';
            _(GUIDER).style.display = 'block';
            _(GUIDER).innerHTML = '<div>' + tourItems[index].hint + '</div>';
            //jQuery('html, body').animate({scrollTop: _(tourItems[index].element).offsetTop}, TIMER);
            current = index;
        }
    }

    function _exitTour() { // 结束向导
        if (_(GUIDER).style.display != 'none') {
            _(GUIDER).style.display = 'none';
			_(GUIDER).removeAttribute('class');
            jQuery.each(tourItems, function () {
                jQuery('#' + this.element).removeClass(GUIDER);
            });
            if (window.removeEventListener) {
                window.removeEventListener('click', _ctrFlow, true);
            } else if (document.detachEvent) { // IE
                document.detachEvent('click', _ctrFlow);
            }
            current = 0;
        }
    }

    return {
        init: _initTour,
        exit: _exitTour
    };

}());