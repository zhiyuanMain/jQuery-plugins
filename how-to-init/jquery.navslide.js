;
(function ($, window, document, undefined) {
    var pluginName = 'navslide';
    var Navslide = function (element, options) {
        this.default = {
            data: [],
            speed: '300'
        };
        this.element = element;
        this.settings = $.extend({}, this.default, options);
        this.$noop = function() {};
        this.init();
    }

    // 插件入口函数
    Navslide.prototype.init = function () {
        this.$nav = this.initNav();
        // 初始化activeItem
        this.initActiveItem();
        // 初始化line
        this.initLine();
        // 绑定hover
        this.bindEventHover();
        // 绑定click
        this.bindEventClick();
    }

    // 根据data渲染html
    Navslide.prototype.initNav = function () {
        var html = [],
            datas = this.settings.data,
            len = datas.length;
        html.push('<ul class="nav-slide-wrapper">');
        for (var i = 0; i < len; i++) {
            html.push(
                '<li class="nav-slide-item',
                    datas[i].isActive ? ' active':'',
                '">',
                    datas[i].text,
                '</li>'
            );
        }
        html.push('<i class="active-line"></i>');
        html.push('</ul>');
        return $(html.join('')).appendTo(this.element);
    }

    // 初始化activeItem
    Navslide.prototype.initActiveItem = function() {
        this.$activeItem = this.$nav.find('.nav-slide-item.active');
        if(!this.$activeItem.length) {
            this.$activeItem = this.$nav.find('.nav-slide-item').eq(0).addClass('active');
        }
    }
    // 初始化line
    Navslide.prototype.initLine = function() {
        this.$line = this.$nav.find('i.active-line');
        this.translateActiveLine(false);
    }

    // 设置activeItem选项
    Navslide.prototype.setActive = function(activeItem) {
        this.setItemActive(activeItem);
        this.$activeItem = activeItem;
    }
    // 给其中仅且一个activeItem设置active选项
    Navslide.prototype.setItemActive = function(item) {
        this.$nav.find('.nav-slide-item').removeClass('active');
        item.addClass('active');
    }
    // 移动line
    Navslide.prototype.translateActiveLine = function(transition) {
        var self = this,
            activeItem = self.$activeItem;
        // 获取当前activeItem的位置信息
        var left = activeItem.position().left,
            width = activeItem.outerWidth();
        this.setLineStyles(self.helperGetStyles(activeItem), transition)
    }
    // line设置样式
    Navslide.prototype.setLineStyles = function(styles, transition, callback) {
        !transition && this.$line.css(styles);
        transition && this.$line
                        .stop(true)
                        .animate(
                            styles, 
                            this.speed, 
                            typeof callback === 'function' ? callback : this.$noop
                        );
    }

    // 绑定hover
    Navslide.prototype.bindEventHover = function() {
        var self = this;
        var nav = self.$nav,
            activeItem = self.$activeItem,
            line = self.$line;
        nav.find('.nav-slide-item').hover(function(event){
            var $this = $(this);
            self.setLineStyles(self.helperGetStyles($this), true);
        }, function(event) {
            //判断是否是item 防止出现hover结束后每次都要回复到原activeItem选项再到当前item这样一个bug
            if($.contains(event.target, '.nav-slide-item')) {
                return;
            }
            self.translateActiveLine(true);
        })
    }
    // 绑定click
    Navslide.prototype.bindEventClick = function() {
        var self = this;
        var clickEvents = ['onBeforeClick', 'onClick', 'onAfterClick'];
        self.$nav
        .off('click.navSlideItem', '.nav-slide-item')
        .on('click.navSlideItem', '.nav-slide-item', function() {
            self.trigger(clickEvents[0]);
            self.setActive($(this));
            self.trigger(clickEvents[1]);
            self.trigger(clickEvents[2]);
        })
    }

    // 辅助函数
    Navslide.prototype.helperGetStyles = function(obj) {
        return {
            left: obj.position().left,
            width: obj.outerWidth()
        }
    }
    // 触发函数
    Navslide.prototype.trigger = function(EventType) {
        typeof this.settings[EventType] === 'function' && this.settings[EventType].call(this);
    }
    $.fn[pluginName] = function (options) {
        return new Navslide(this, options);
    }
})(jQuery, window, document);