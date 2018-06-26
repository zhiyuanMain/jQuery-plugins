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
        this.init();
    }

    // 插件入口函数
    Navslide.prototype.init = function () {
        this.$nav = this.initNav();
        // 初始化activeItem
        this.initActiveItem();
        // 初始化line
        this.initLine();
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
        this.$activeItem = activeItem;
    }
    // 移动line
    Navslide.prototype.translateActiveLine = function(transition) {
        var self = this,
            activeItem = self.$activeItem,
            line = self.$line;
        // 获取当前activeItem的位置信息
        var left = activeItem.position().left,
            width = activeItem.outerWidth();
        console.log(left, width)
        transition && self.setLineStyles.animate(function() {
            line({
                left: left,
                width: width 
            })
        }, self.speed);
        !transition && self.setLineStyles({
            left: left,
            width: width
        });
    }
    // line设置样式
    Navslide.prototype.setLineStyles = function(styles) {
        this.$line.css(styles);
    }

    // 绑定hover
    Navslide.prototype.bindHover = function() {
        var self = this;
        var nav = self.$nav,
            activeItem = self.$activeItem,
            line = self.$line;
        nav.find('.nav-slide-item').hover(function(){

        }, function() {

        })
    }
    $.fn[pluginName] = function (options) {
        return new Navslide(this, options);
    }
})(jQuery, window, document);