/**
 * Super simple wysiwyg editor v0.8.12
 * https://summernote.org
 *
 * Copyright 2013- Alan Hong. and other contributors
 * summernote may be freely distributed under the MIT license.
 *
 * Date: 2023-05-16T08:16Z
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
        typeof define === 'function' && define.amd ? define(['jquery'], factory) :
            (global = global || self, factory(global.jQuery));
}(this, function ($$1) {
    'use strict';

    $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

    var Renderer = /** @class */ (function () {
        function Renderer(markup, children, options, callback) {
            this.markup = markup;
            this.children = children;
            this.options = options;
            this.callback = callback;
        }
        Renderer.prototype.render = function ($parent) {
            var $node = $$1(this.markup);
            if (this.options && this.options.contents) {
                $node.html(this.options.contents);
            }
            if (this.options && this.options.className) {
                $node.addClass(this.options.className);
            }
            if (this.options && this.options.data) {
                $$1.each(this.options.data, function (k, v) {
                    $node.attr('data-' + k, v);
                });
            }
            if (this.options && this.options.click) {
                $node.on('click', this.options.click);
            }
            if (this.children) {
                var $container_1 = $node.find('.note-children-container');
                this.children.forEach(function (child) {
                    child.render($container_1.length ? $container_1 : $node);
                });
            }
            if (this.callback) {
                this.callback($node, this.options);
            }
            if (this.options && this.options.callback) {
                this.options.callback($node);
            }
            if ($parent) {
                $parent.append($node);
            }
            return $node;
        };
        return Renderer;
    }());
    var renderer = {
        create: function (markup, callback) {
            return function () {
                var options = typeof arguments[1] === 'object' ? arguments[1] : arguments[0];
                var children = Array.isArray(arguments[0]) ? arguments[0] : [];
                if (options && options.children) {
                    children = options.children;
                }
                return new Renderer(markup, children, options, callback);
            };
        }
    };

    var TooltipUI = /** @class */ (function () {
        function TooltipUI($node, options) {
            this.$node = $node;
            this.options = $.extend({}, {
                title: '',
                target: options.container,
                trigger: 'hover focus',
                placement: 'bottom'
            }, options);
            // create tooltip node
            this.$tooltip = $([
                '<div class="note-tooltip in">',
                '  <div class="note-tooltip-arrow"/>',
                '  <div class="note-tooltip-content"/>',
                '</div>',
            ].join(''));
            // define event
            if (this.options.trigger !== 'manual') {
                var showCallback_1 = this.show.bind(this);
                var hideCallback_1 = this.hide.bind(this);
                var toggleCallback_1 = this.toggle.bind(this);
                this.options.trigger.split(' ').forEach(function (eventName) {
                    if (eventName === 'hover') {
                        $node.off('mouseenter mouseleave');
                        $node.on('mouseenter', showCallback_1).on('mouseleave', hideCallback_1);
                    }
                    else if (eventName === 'click') {
                        $node.on('click', toggleCallback_1);
                    }
                    else if (eventName === 'focus') {
                        $node.on('focus', showCallback_1).on('blur', hideCallback_1);
                    }
                });
            }
        }
        TooltipUI.prototype.show = function () {
            var $node = this.$node;
            var offset = $node.offset();
            var $tooltip = this.$tooltip;
            var title = this.options.title || $node.attr('title') || $node.data('title');
            var placement = this.options.placement || $node.data('placement');
            $tooltip.addClass(placement);
            $tooltip.addClass('in');
            $tooltip.find('.note-tooltip-content').text(title);
            $tooltip.appendTo(this.options.target);
            var nodeWidth = $node.outerWidth();
            var nodeHeight = $node.outerHeight();
            var tooltipWidth = $tooltip.outerWidth();
            var tooltipHeight = $tooltip.outerHeight();
            if (placement === 'bottom') {
                $tooltip.css({
                    top: offset.top + nodeHeight,
                    left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
                });
            }
            else if (placement === 'top') {
                $tooltip.css({
                    top: offset.top - tooltipHeight,
                    left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
                });
            }
            else if (placement === 'left') {
                $tooltip.css({
                    top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
                    left: offset.left - tooltipWidth
                });
            }
            else if (placement === 'right') {
                $tooltip.css({
                    top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
                    left: offset.left + nodeWidth
                });
            }
        };
        TooltipUI.prototype.hide = function () {
            this.$tooltip.removeClass('in');
            this.$tooltip.remove();
        };
        TooltipUI.prototype.toggle = function () {
            if (this.$tooltip.hasClass('in')) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        return TooltipUI;
    }());

    var DropdownUI = /** @class */ (function () {
        function DropdownUI($node, options) {
            this.$button = $node;
            this.options = $.extend({}, {
                target: options.container
            }, options);
            this.setEvent();
        }
        DropdownUI.prototype.setEvent = function () {
            var _this = this;
            this.$button.on('click', function (e) {
                _this.toggle();
                e.stopImmediatePropagation();
            });
        };
        DropdownUI.prototype.clear = function () {
            var $parent = $('.note-btn-group.open');
            $parent.find('.note-btn.active').removeClass('active');
            $parent.removeClass('open');
        };
        DropdownUI.prototype.show = function () {
            this.$button.addClass('active');
            this.$button.parent().addClass('open');
            var $dropdown = this.$button.next();
            var offset = $dropdown.offset();
            var width = $dropdown.outerWidth();
            var windowWidth = $(window).width();
            var targetMarginRight = parseFloat($(this.options.target).css('margin-right'));
            if (offset.left + width > windowWidth - targetMarginRight) {
                $dropdown.css('margin-left', windowWidth - targetMarginRight - (offset.left + width));
            }
            else {
                $dropdown.css('margin-left', '');
            }
        };
        DropdownUI.prototype.hide = function () {
            this.$button.removeClass('active');
            this.$button.parent().removeClass('open');
        };
        DropdownUI.prototype.toggle = function () {
            var isOpened = this.$button.parent().hasClass('open');
            this.clear();
            if (isOpened) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        return DropdownUI;
    }());
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.note-btn-group').length) {
            $('.note-btn-group.open').removeClass('open');
        }
    });
    $(document).on('click.note-dropdown-menu', function (e) {
        $(e.target).closest('.note-dropdown-menu').parent().removeClass('open');
    });

    var ModalUI = /** @class */ (function () {
        function ModalUI($node, options) {
            this.options = $.extend({}, {
                target: options.container || 'body'
            }, options);
            this.$modal = $node;
            this.$backdrop = $('<div class="note-modal-backdrop" />');
        }
        ModalUI.prototype.show = function () {
            if (this.options.target === 'body') {
                this.$backdrop.css('position', 'fixed');
                this.$modal.css('position', 'fixed');
            }
            else {
                this.$backdrop.css('position', 'absolute');
                this.$modal.css('position', 'absolute');
            }
            this.$backdrop.appendTo(this.options.target).show();
            this.$modal.appendTo(this.options.target).addClass('open').show();
            this.$modal.trigger('note.modal.show');
            this.$modal.off('click', '.close').on('click', '.close', this.hide.bind(this));
        };
        ModalUI.prototype.hide = function () {
            this.$modal.removeClass('open').hide();
            this.$backdrop.hide();
            this.$modal.trigger('note.modal.hide');
        };
        return ModalUI;
    }());

    var editor = renderer.create('<div class="note-editor note-frame"/>');
    var toolbar = renderer.create('<div class="note-toolbar" role="toolbar"/>');
    var editingArea = renderer.create('<div class="note-editing-area"/>');
    var codable = renderer.create('<textarea class="note-codable" role="textbox" aria-multiline="true"/>');
    var editable = renderer.create('<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"/>');
    var statusbar = renderer.create([
        '<output class="note-status-output" role="status" aria-live="polite"/>',
        '<div class="note-statusbar" role="resize">',
        '  <div class="note-resizebar" role="seperator" aria-orientation="horizontal" aria-label="resize">',
        '    <div class="note-icon-bar"/>',
        '    <div class="note-icon-bar"/>',
        '    <div class="note-icon-bar"/>',
        '  </div>',
        '</div>',
    ].join(''));
    var airEditor = renderer.create('<div class="note-editor"/>');
    var airEditable = renderer.create([
        '<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"/>',
        '<output class="note-status-output" role="status" aria-live="polite"/>',
    ].join(''));
    var buttonGroup = renderer.create('<div class="note-btn-group">');
    var button = renderer.create('<button type="button" class="note-btn" role="button" tabindex="-1">', function ($node, options) {
        // set button type
        if (options && options.tooltip) {
            $node.attr({
                'aria-label': options.tooltip
            });
            $node.data('_lite_tooltip', new TooltipUI($node, {
                title: options.tooltip,
                container: options.container
            })).on('click', function (e) {
                $(e.currentTarget).data('_lite_tooltip').hide();
            });
        }
        if (options.contents) {
            $node.html(options.contents);
        }
        if (options && options.data && options.data.toggle === 'dropdown') {
            $node.data('_lite_dropdown', new DropdownUI($node, {
                container: options.container
            }));
        }
    });
    var dropdown = renderer.create('<div class="note-dropdown-menu" role="list">', function ($node, options) {
        var markup = Array.isArray(options.items) ? options.items.map(function (item) {
            var value = (typeof item === 'string') ? item : (item.value || '');
            var content = options.template ? options.template(item) : item;
            var $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + value + '"></a>');
            $temp.html(content).data('item', item);
            return $temp;
        }) : options.items;
        $node.html(markup).attr({ 'aria-label': options.title });
        $node.on('click', '> .note-dropdown-item', function (e) {
            var $a = $(this);
            var item = $a.data('item');
            var value = $a.data('value');
            if (item.click) {
                item.click($a);
            }
            else if (options.itemClick) {
                options.itemClick(e, item, value);
            }
        });
    });
    var dropdownCheck = renderer.create('<div class="note-dropdown-menu note-check" role="list">', function ($node, options) {
        var markup = Array.isArray(options.items) ? options.items.map(function (item) {
            var value = (typeof item === 'string') ? item : (item.value || '');
            var content = options.template ? options.template(item) : item;
            var $temp = $('<a class="note-dropdown-item" href="#" data-value="' + value + '" role="listitem" aria-label="' + item + '"></a>');
            $temp.html([icon(options.checkClassName), ' ', content]).data('item', item);
            return $temp;
        }) : options.items;
        $node.html(markup).attr({ 'aria-label': options.title });
        $node.on('click', '> .note-dropdown-item', function (e) {
            var $a = $(this);
            var item = $a.data('item');
            var value = $a.data('value');
            if (item.click) {
                item.click($a);
            }
            else if (options.itemClick) {
                options.itemClick(e, item, value);
            }
        });
    });
    var dropdownButtonContents = function (contents, options) {
        return contents + ' ' + icon(options.icons.caret, 'span');
    };
    var dropdownButton = function (opt, callback) {
        return buttonGroup([
            button({
                className: 'dropdown-toggle',
                contents: opt.title + ' ' + icon('note-icon-caret'),
                tooltip: opt.tooltip,
                data: {
                    toggle: 'dropdown'
                }
            }),
            dropdown({
                className: opt.className,
                items: opt.items,
                template: opt.template,
                itemClick: opt.itemClick
            }),
        ], { callback: callback }).render();
    };
    var dropdownCheckButton = function (opt, callback) {
        return buttonGroup([
            button({
                className: 'dropdown-toggle',
                contents: opt.title + ' ' + icon('note-icon-caret'),
                tooltip: opt.tooltip,
                data: {
                    toggle: 'dropdown'
                }
            }),
            dropdownCheck({
                className: opt.className,
                checkClassName: opt.checkClassName,
                items: opt.items,
                template: opt.template,
                itemClick: opt.itemClick
            }),
        ], { callback: callback }).render();
    };
    var paragraphDropdownButton = function (opt) {
        return buttonGroup([
            button({
                className: 'dropdown-toggle',
                contents: opt.title + ' ' + icon('note-icon-caret'),
                tooltip: opt.tooltip,
                data: {
                    toggle: 'dropdown'
                }
            }),
            dropdown([
                buttonGroup({
                    className: 'note-align',
                    children: opt.items[0]
                }),
                buttonGroup({
                    className: 'note-list',
                    children: opt.items[1]
                }),
            ]),
        ]).render();
    };
    var tableMoveHandler = function (event, col, row) {
        var PX_PER_EM = 18;
        var $picker = $(event.target.parentNode); // target is mousecatcher
        var $dimensionDisplay = $picker.next();
        var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
        var $highlighted = $picker.find('.note-dimension-picker-highlighted');
        var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
        var posOffset;
        // HTML5 with jQuery - e.offsetX is undefined in Firefox
        if (event.offsetX === undefined) {
            var posCatcher = $(event.target).offset();
            posOffset = {
                x: event.pageX - posCatcher.left,
                y: event.pageY - posCatcher.top
            };
        }
        else {
            posOffset = {
                x: event.offsetX,
                y: event.offsetY
            };
        }
        var dim = {
            c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
            r: Math.ceil(posOffset.y / PX_PER_EM) || 1
        };
        $highlighted.css({ width: dim.c + 'em', height: dim.r + 'em' });
        $catcher.data('value', dim.c + 'x' + dim.r);
        if (dim.c > 3 && dim.c < col) {
            $unhighlighted.css({ width: dim.c + 1 + 'em' });
        }
        if (dim.r > 3 && dim.r < row) {
            $unhighlighted.css({ height: dim.r + 1 + 'em' });
        }
        $dimensionDisplay.html(dim.c + ' x ' + dim.r);
    };
    var tableDropdownButton = function (opt) {
        return buttonGroup([
            button({
                className: 'dropdown-toggle',
                contents: opt.title + ' ' + icon('note-icon-caret'),
                tooltip: opt.tooltip,
                data: {
                    toggle: 'dropdown'
                }
            }),
            dropdown({
                className: 'note-table',
                items: [
                    '<div class="note-dimension-picker">',
                    '  <div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"/>',
                    '  <div class="note-dimension-picker-highlighted"/>',
                    '  <div class="note-dimension-picker-unhighlighted"/>',
                    '</div>',
                    '<div class="note-dimension-display">1 x 1</div>',
                ].join('')
            }),
        ], {
            callback: function ($node) {
                var $catcher = $node.find('.note-dimension-picker-mousecatcher');
                $catcher.css({
                    width: opt.col + 'em',
                    height: opt.row + 'em'
                })
                    .mousedown(opt.itemClick)
                    .mousemove(function (e) {
                        tableMoveHandler(e, opt.col, opt.row);
                    });
            }
        }).render();
    };
    var palette = renderer.create('<div class="note-color-palette"/>', function ($node, options) {
        var contents = [];
        for (var row = 0, rowSize = options.colors.length; row < rowSize; row++) {
            var eventName = options.eventName;
            var colors = options.colors[row];
            var colorsName = options.colorsName[row];
            var buttons = [];
            for (var col = 0, colSize = colors.length; col < colSize; col++) {
                var color = colors[col];
                var colorName = colorsName[col];
                buttons.push([
                    '<button type="button" class="note-btn note-color-btn"',
                    'style="background-color:', color, '" ',
                    'data-event="', eventName, '" ',
                    'data-value="', color, '" ',
                    'title="', colorName, '" ',
                    'aria-label="', colorName, '" ',
                    'data-toggle="button" tabindex="-1"></button>',
                ].join(''));
            }
            contents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
        }
        $node.html(contents.join(''));
        $node.find('.note-color-btn').each(function () {
            $(this).data('_lite_tooltip', new TooltipUI($(this), {
                container: options.container
            }));
        });
    });
    var colorDropdownButton = function (opt, type) {
        return buttonGroup({
            className: 'note-color',
            children: [
                button({
                    className: 'note-current-color-button',
                    contents: opt.title,
                    tooltip: opt.lang.color.recent,
                    click: opt.currentClick,
                    callback: function ($button) {
                        var $recentColor = $button.find('.note-recent-color');
                        if (type !== 'foreColor') {
                            $recentColor.css('background-color', '#FFFF00');
                            $button.attr('data-backColor', '#FFFF00');
                        }
                    }
                }),
                button({
                    className: 'dropdown-toggle',
                    contents: icon('note-icon-caret'),
                    tooltip: opt.lang.color.more,
                    data: {
                        toggle: 'dropdown'
                    }
                }),
                dropdown({
                    items: [
                        '<div>',
                        '<div class="note-btn-group btn-background-color">',
                        '  <div class="note-palette-title">' + opt.lang.color.background + '</div>',
                        '  <div>',
                        '<button type="button" class="note-color-reset note-btn note-btn-block" ' +
                        ' data-event="backColor" data-value="inherit">',
                        opt.lang.color.transparent,
                        '    </button>',
                        '  </div>',
                        '  <div class="note-holder" data-event="backColor"/>',
                        '  <div class="btn-sm">',
                        '    <input type="color" id="html5bcp" class="note-btn btn-default" value="#21104A" style="width:100%;" data-value="cp">',
                        '    <button type="button" class="note-color-reset btn" data-event="backColor" data-value="cpbackColor">',
                        opt.lang.color.cpSelect,
                        '    </button>',
                        '  </div>',
                        '</div>',
                        '<div class="note-btn-group btn-foreground-color">',
                        '  <div class="note-palette-title">' + opt.lang.color.foreground + '</div>',
                        '  <div>',
                        '<button type="button" class="note-color-reset note-btn note-btn-block" ' +
                        ' data-event="removeFormat" data-value="foreColor">',
                        opt.lang.color.resetToDefault,
                        '    </button>',
                        '  </div>',
                        '  <div class="note-holder" data-event="foreColor"/>',
                        '  <div class="btn-sm">',
                        '    <input type="color" id="html5fcp" class="note-btn btn-default" value="#21104A" style="width:100%;" data-value="cp">',
                        '    <button type="button" class="note-color-reset btn" data-event="foreColor" data-value="cpforeColor">',
                        opt.lang.color.cpSelect,
                        '    </button>',
                        '  </div>',
                        '</div>',
                        '</div>',
                    ].join(''),
                    callback: function ($dropdown) {
                        $dropdown.find('.note-holder').each(function () {
                            var $holder = $(this);
                            $holder.append(palette({
                                colors: opt.colors,
                                eventName: $holder.data('event')
                            }).render());
                        });
                        if (type === 'fore') {
                            $dropdown.find('.btn-background-color').hide();
                            $dropdown.css({ 'min-width': '210px' });
                        }
                        else if (type === 'back') {
                            $dropdown.find('.btn-foreground-color').hide();
                            $dropdown.css({ 'min-width': '210px' });
                        }
                    },
                    click: function (event) {
                        var $button = $(event.target);
                        var eventName = $button.data('event');
                        var value = $button.data('value');
                        var foreinput = document.getElementById('html5fcp').value;
                        var backinput = document.getElementById('html5bcp').value;
                        if (value === 'cp') {
                            event.stopPropagation();
                        }
                        else if (value === 'cpbackColor') {
                            value = backinput;
                        }
                        else if (value === 'cpforeColor') {
                            value = foreinput;
                        }
                        if (eventName && value) {
                            var key = eventName === 'backColor' ? 'background-color' : 'color';
                            var $color = $button.closest('.note-color').find('.note-recent-color');
                            var $currentButton = $button.closest('.note-color').find('.note-current-color-button');
                            $color.css(key, value);
                            $currentButton.attr('data-' + eventName, value);
                            if (type === 'fore') {
                                opt.itemClick('foreColor', value);
                            }
                            else if (type === 'back') {
                                opt.itemClick('backColor', value);
                            }
                            else {
                                opt.itemClick(eventName, value);
                            }
                        }
                    }
                }),
            ]
        }).render();
    };
    var dialog = renderer.create('<div class="note-modal" aria-hidden="false" tabindex="-1" role="dialog"/>', function ($node, options) {
        if (options.fade) {
            $node.addClass('fade');
        }
        $node.attr({
            'aria-label': options.title
        });
        $node.html([
            '  <div class="note-modal-content">',
            (options.title
                ? '    <div class="note-modal-header">' +
                '      <button type="button" class="close" aria-label="Close" aria-hidden="true"><i class="note-icon-close"></i></button>' +
                '      <h4 class="note-modal-title">' + options.title + '</h4>' +
                '    </div>' : ''),
            '    <div class="note-modal-body">' + options.body + '</div>',
            (options.footer
                ? '    <div class="note-modal-footer">' + options.footer + '</div>' : ''),
            '  </div>',
        ].join(''));
        $node.data('modal', new ModalUI($node, options));
    });
    var videoDialog = function (opt) {
        var body = '<div class="note-form-group">' +
            '<label class="note-form-label">' +
            opt.lang.video.url + ' <small class="text-muted">' +
            opt.lang.video.providers + '</small>' +
            '</label>' +
            '<input class="note-video-url note-input" type="text" />' +
            '</div>';
        var footer = [
            '<button type="button" href="#" class="note-btn note-btn-primary note-video-btn disabled" disabled>',
            opt.lang.video.insert,
            '</button>',
        ].join('');
        return dialog({
            title: opt.lang.video.insert,
            fade: opt.fade,
            body: body,
            footer: footer
        }).render();
    };
    var imageDialog = function (opt) {
        var body = '<div class="note-form-group note-group-select-from-files">' +
            '<label class="note-form-label">' + opt.lang.image.selectFromFiles + '</label>' +
            '<input class="note-note-image-input note-input" type="file" name="files" accept="image/*" multiple="multiple" />' +
            opt.imageLimitation +
            '</div>' +
            '<div class="note-form-group" style="overflow:auto;">' +
            '<label class="note-form-label">' + opt.lang.image.url + '</label>' +
            '<input class="note-image-url note-input" type="text" />' +
            '</div>';
        var footer = [
            '<button href="#" type="button" class="note-btn note-btn-primary note-btn-large note-image-btn disabled" disabled>',
            opt.lang.image.insert,
            '</button>',
        ].join('');
        return dialog({
            title: opt.lang.image.insert,
            fade: opt.fade,
            body: body,
            footer: footer
        }).render();
    };
    var linkDialog = function (opt) {
        var body = '<div class="note-form-group">' +
            '<label class="note-form-label">' + opt.lang.link.textToDisplay + '</label>' +
            '<input class="note-link-text note-input" type="text" />' +
            '</div>' +
            '<div class="note-form-group">' +
            '<label class="note-form-label">' + opt.lang.link.url + '</label>' +
            '<input class="note-link-url note-input" type="text" value="http://" />' +
            '</div>' +
            (!opt.disableLinkTarget
                ? '<div class="checkbox">' +
                '<label>' + '<input type="checkbox" checked> ' + opt.lang.link.openInNewWindow + '</label>' +
                '</div>' : '');
        var footer = [
            '<button href="#" type="button" class="note-btn note-btn-primary note-link-btn disabled" disabled>',
            opt.lang.link.insert,
            '</button>',
        ].join('');
        return dialog({
            className: 'link-dialog',
            title: opt.lang.link.insert,
            fade: opt.fade,
            body: body,
            footer: footer
        }).render();
    };
    var popover = renderer.create([
        '<div class="note-popover bottom">',
        '  <div class="note-popover-arrow"/>',
        '  <div class="popover-content note-children-container"/>',
        '</div>',
    ].join(''), function ($node, options) {
        var direction = typeof options.direction !== 'undefined' ? options.direction : 'bottom';
        $node.addClass(direction).hide();
        if (options.hideArrow) {
            $node.find('.note-popover-arrow').hide();
        }
    });
    var checkbox = renderer.create('<div class="checkbox"></div>', function ($node, options) {
        $node.html([
            '<label' + (options.id ? ' for="' + options.id + '"' : '') + '>',
            ' <input role="checkbox" type="checkbox"' + (options.id ? ' id="' + options.id + '"' : ''),
            (options.checked ? ' checked' : ''),
            ' aria-checked="' + (options.checked ? 'true' : 'false') + '"/>',
            (options.text ? options.text : ''),
            '</label>',
        ].join(''));
    });
    var icon = function (iconClassName, tagName) {
        tagName = tagName || 'i';
        return '<' + tagName + ' class="' + iconClassName + '"/>';
    };
    var ui = {
        editor: editor,
        toolbar: toolbar,
        editingArea: editingArea,
        codable: codable,
        editable: editable,
        statusbar: statusbar,
        airEditor: airEditor,
        airEditable: airEditable,
        buttonGroup: buttonGroup,
        button: button,
        dropdown: dropdown,
        dropdownCheck: dropdownCheck,
        dropdownButton: dropdownButton,
        dropdownButtonContents: dropdownButtonContents,
        dropdownCheckButton: dropdownCheckButton,
        paragraphDropdownButton: paragraphDropdownButton,
        tableDropdownButton: tableDropdownButton,
        colorDropdownButton: colorDropdownButton,
        palette: palette,
        dialog: dialog,
        videoDialog: videoDialog,
        imageDialog: imageDialog,
        linkDialog: linkDialog,
        popover: popover,
        checkbox: checkbox,
        icon: icon,
        toggleBtn: function ($btn, isEnable) {
            $btn.toggleClass('disabled', !isEnable);
            $btn.attr('disabled', !isEnable);
        },
        toggleBtnActive: function ($btn, isActive) {
            $btn.toggleClass('active', isActive);
        },
        check: function ($dom, value) {
            $dom.find('.checked').removeClass('checked');
            $dom.find('[data-value="' + value + '"]').addClass('checked');
        },
        onDialogShown: function ($dialog, handler) {
            $dialog.one('note.modal.show', handler);
        },
        onDialogHidden: function ($dialog, handler) {
            $dialog.one('note.modal.hide', handler);
        },
        showDialog: function ($dialog) {
            $dialog.data('modal').show();
        },
        hideDialog: function ($dialog) {
            $dialog.data('modal').hide();
        },
        /**
         * get popover content area
         *
         * @param $popover
         * @returns {*}
         */
        getPopoverContent: function ($popover) {
            return $popover.find('.note-popover-content');
        },
        /**
         * get dialog's body area
         *
         * @param $dialog
         * @returns {*}
         */
        getDialogBody: function ($dialog) {
            return $dialog.find('.note-modal-body');
        },
        createLayout: function ($note, options) {
            var $editor = (options.airMode ? ui.airEditor([
                ui.editingArea([
                    ui.airEditable(),
                ]),
            ]) : ui.editor([
                ui.toolbar(),
                ui.editingArea([
                    ui.codable(),
                    ui.editable(),
                ]),
                ui.statusbar(),
            ])).render();
            $editor.insertAfter($note);
            return {
                note: $note,
                editor: $editor,
                toolbar: $editor.find('.note-toolbar'),
                editingArea: $editor.find('.note-editing-area'),
                editable: $editor.find('.note-editable'),
                codable: $editor.find('.note-codable'),
                statusbar: $editor.find('.note-statusbar')
            };
        },
        removeLayout: function ($note, layoutInfo) {
            $note.html(layoutInfo.editable.html());
            layoutInfo.editor.remove();
            $note.off('summernote'); // remove summernote custom event
            $note.show();
        }
    };

    $$1.summernote = $$1.summernote || {
        lang: {}
    };
    $$1.extend($$1.summernote.lang, {
        'en-US': {
            font: {
                bold: 'Bold',
                italic: 'Italic',
                underline: 'Underline',
                clear: 'Remove Font Style',
                height: 'Line Height',
                name: 'Font Family',
                strikethrough: 'Strikethrough',
                subscript: 'Subscript',
                superscript: 'Superscript',
                size: 'Font Size'
            },
            image: {
                image: 'Picture',
                insert: 'Insert Image',
                resizeFull: 'Resize full',
                resizeHalf: 'Resize half',
                resizeQuarter: 'Resize quarter',
                resizeNone: 'Original size',
                floatLeft: 'Float Left',
                floatRight: 'Float Right',
                floatNone: 'Remove float',
                shapeRounded: 'Shape: Rounded',
                shapeCircle: 'Shape: Circle',
                shapeThumbnail: 'Shape: Thumbnail',
                shapeNone: 'Shape: None',
                dragImageHere: 'Drag image or text here',
                dropImage: 'Drop image or Text',
                selectFromFiles: 'Select from files',
                maximumFileSize: 'Maximum file size',
                maximumFileSizeError: 'Maximum file size exceeded.',
                url: 'Image URL',
                remove: 'Remove Image',
                original: 'Original'
            },
            video: {
                video: 'Video',
                videoLink: 'Video Link',
                insert: 'Insert Video',
                url: 'Video URL',
                providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)'
            },
            link: {
                link: 'Link',
                insert: 'Insert Link',
                unlink: 'Unlink',
                edit: 'Edit',
                textToDisplay: 'Text to display',
                url: 'To what URL should this link go?',
                openInNewWindow: 'Open in new window'
            },
            table: {
                table: 'Table',
                addRowAbove: 'Add row above',
                addRowBelow: 'Add row below',
                addColLeft: 'Add column left',
                addColRight: 'Add column right',
                delRow: 'Delete row',
                delCol: 'Delete column',
                delTable: 'Delete table'
            },
            hr: {
                insert: 'Insert Horizontal Rule'
            },
            style: {
                style: 'Style',
                p: 'Normal',
                blockquote: 'Quote',
                pre: 'Code',
                h1: 'Header 1',
                h2: 'Header 2',
                h3: 'Header 3',
                h4: 'Header 4',
                h5: 'Header 5',
                h6: 'Header 6'
            },
            lists: {
                unordered: 'Unordered list',
                ordered: 'Ordered list'
            },
            options: {
                help: 'Help',
                fullscreen: 'Full Screen',
                codeview: 'Code View'
            },
            paragraph: {
                paragraph: 'Paragraph',
                outdent: 'Outdent',
                indent: 'Indent',
                left: 'Align left',
                center: 'Align center',
                right: 'Align right',
                justify: 'Justify full'
            },
            color: {
                recent: 'Recent Color',
                more: 'More Color',
                background: 'Background Color',
                foreground: 'Foreground Color',
                transparent: 'Transparent',
                setTransparent: 'Set transparent',
                reset: 'Reset',
                resetToDefault: 'Reset to default',
                cpSelect: 'Select'
            },
            shortcut: {
                shortcuts: 'Keyboard shortcuts',
                close: 'Close',
                textFormatting: 'Text formatting',
                action: 'Action',
                paragraphFormatting: 'Paragraph formatting',
                documentStyle: 'Document Style',
                extraKeys: 'Extra keys'
            },
            help: {
                'insertParagraph': 'Insert Paragraph',
                'undo': 'Undoes the last command',
                'redo': 'Redoes the last command',
                'tab': 'Tab',
                'untab': 'Untab',
                'bold': 'Set a bold style',
                'italic': 'Set a italic style',
                'underline': 'Set a underline style',
                'strikethrough': 'Set a strikethrough style',
                'removeFormat': 'Clean a style',
                'justifyLeft': 'Set left align',
                'justifyCenter': 'Set center align',
                'justifyRight': 'Set right align',
                'justifyFull': 'Set full align',
                'insertUnorderedList': 'Toggle unordered list',
                'insertOrderedList': 'Toggle ordered list',
                'outdent': 'Outdent on current paragraph',
                'indent': 'Indent on current paragraph',
                'formatPara': 'Change current block\'s format as a paragraph(P tag)',
                'formatH1': 'Change current block\'s format as H1',
                'formatH2': 'Change current block\'s format as H2',
                'formatH3': 'Change current block\'s format as H3',
                'formatH4': 'Change current block\'s format as H4',
                'formatH5': 'Change current block\'s format as H5',
                'formatH6': 'Change current block\'s format as H6',
                'insertHorizontalRule': 'Insert horizontal rule',
                'linkDialog.show': 'Show Link Dialog'
            },
            history: {
                undo: 'Undo',
                redo: 'Redo'
            },
            specialChar: {
                specialChar: 'SPECIAL CHARACTERS',
                select: 'Select Special characters'
            }
        }
    });

    var isSupportAmd = typeof define === 'function' && define.amd; // eslint-disable-line
    /**
     * returns whether font is installed or not.
     *
     * @param {String} fontName
     * @return {Boolean}
     */
    function isFontInstalled(fontName) {
        var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
        var testText = 'mmmmmmmmmmwwwww';
        var testSize = '200px';
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = testSize + " '" + testFontName + "'";
        var originalWidth = context.measureText(testText).width;
        context.font = testSize + " '" + fontName + "', '" + testFontName + "'";
        var width = context.measureText(testText).width;
        return originalWidth !== width;
    }
    var userAgent = navigator.userAgent;
    var isMSIE = /MSIE|Trident/i.test(userAgent);
    var browserVersion;
    if (isMSIE) {
        var matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = parseFloat(matches[1]);
        }
        matches = /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.exec(userAgent);
        if (matches) {
            browserVersion = parseFloat(matches[1]);
        }
    }
    var isEdge = /Edge\/\d+/.test(userAgent);
    var hasCodeMirror = !!window.CodeMirror;
    var isSupportTouch = (('ontouchstart' in window) ||
        (navigator.MaxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    // [workaround] IE doesn't have input events for contentEditable
    // - see: https://goo.gl/4bfIvA
    var inputEventName = (isMSIE || isEdge) ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';
    /**
     * @class core.env
     *
     * Object which check platform and agent
     *
     * @singleton
     * @alternateClassName env
     */
    var env = {
        isMac: navigator.appVersion.indexOf('Mac') > -1,
        isMSIE: isMSIE,
        isEdge: isEdge,
        isFF: !isEdge && /firefox/i.test(userAgent),
        isPhantom: /PhantomJS/i.test(userAgent),
        isWebkit: !isEdge && /webkit/i.test(userAgent),
        isChrome: !isEdge && /chrome/i.test(userAgent),
        isSafari: !isEdge && /safari/i.test(userAgent),
        browserVersion: browserVersion,
        jqueryVersion: parseFloat($$1.fn.jquery),
        isSupportAmd: isSupportAmd,
        isSupportTouch: isSupportTouch,
        hasCodeMirror: hasCodeMirror,
        isFontInstalled: isFontInstalled,
        isW3CRangeSupport: !!document.createRange,
        inputEventName: inputEventName
    };

    /**
     * @class core.func
     *
     * func utils (for high-order func's arg)
     *
     * @singleton
     * @alternateClassName func
     */
    function eq(itemA) {
        return function (itemB) {
            return itemA === itemB;
        };
    }
    function eq2(itemA, itemB) {
        return itemA === itemB;
    }
    function peq2(propName) {
        return function (itemA, itemB) {
            return itemA[propName] === itemB[propName];
        };
    }
    function ok() {
        return true;
    }
    function fail() {
        return false;
    }
    function not(f) {
        return function () {
            return !f.apply(f, arguments);
        };
    }
    function and(fA, fB) {
        return function (item) {
            return fA(item) && fB(item);
        };
    }
    function self(a) {
        return a;
    }
    function invoke(obj, method) {
        return function () {
            return obj[method].apply(obj, arguments);
        };
    }
    var idCounter = 0;
    /**
     * generate a globally-unique id
     *
     * @param {String} [prefix]
     */
    function uniqueId(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    }
    /**
     * returns bnd (bounds) from rect
     *
     * - IE Compatibility Issue: http://goo.gl/sRLOAo
     * - Scroll Issue: http://goo.gl/sNjUc
     *
     * @param {Rect} rect
     * @return {Object} bounds
     * @return {Number} bounds.top
     * @return {Number} bounds.left
     * @return {Number} bounds.width
     * @return {Number} bounds.height
     */
    function rect2bnd(rect) {
        var $document = $(document);
        return {
            top: rect.top + $document.scrollTop(),
            left: rect.left + $document.scrollLeft(),
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };
    }
    /**
     * returns a copy of the object where the keys have become the values and the values the keys.
     * @param {Object} obj
     * @return {Object}
     */
    function invertObject(obj) {
        var inverted = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                inverted[obj[key]] = key;
            }
        }
        return inverted;
    }
    /**
     * @param {String} namespace
     * @param {String} [prefix]
     * @return {String}
     */
    function namespaceToCamel(namespace, prefix) {
        prefix = prefix || '';
        return prefix + namespace.split('.').map(function (name) {
            return name.substring(0, 1).toUpperCase() + name.substring(1);
        }).join('');
    }
    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param {Function} func
     * @param {Number} wait
     * @param {Boolean} immediate
     * @return {Function}
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    /**
     *
     * @param {String} url
     * @return {Boolean}
     */
    function isValidUrl(url) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        return expression.test(url);
    }
    var func = {
        eq: eq,
        eq2: eq2,
        peq2: peq2,
        ok: ok,
        fail: fail,
        self: self,
        not: not,
        and: and,
        invoke: invoke,
        uniqueId: uniqueId,
        rect2bnd: rect2bnd,
        invertObject: invertObject,
        namespaceToCamel: namespaceToCamel,
        debounce: debounce,
        isValidUrl: isValidUrl
    };

    /**
     * returns the first item of an array.
     *
     * @param {Array} array
     */
    function head(array) {
        return array[0];
    }
    /**
     * returns the last item of an array.
     *
     * @param {Array} array
     */
    function last(array) {
        return array[array.length - 1];
    }
    /**
     * returns everything but the last entry of the array.
     *
     * @param {Array} array
     */
    function initial(array) {
        return array.slice(0, array.length - 1);
    }
    /**
     * returns the rest of the items in an array.
     *
     * @param {Array} array
     */
    function tail(array) {
        return array.slice(1);
    }
    /**
     * returns item of array
     */
    function find(array, pred) {
        for (var idx = 0, len = array.length; idx < len; idx++) {
            var item = array[idx];
            if (pred(item)) {
                return item;
            }
        }
    }
    /**
     * returns true if all of the values in the array pass the predicate truth test.
     */
    function all(array, pred) {
        for (var idx = 0, len = array.length; idx < len; idx++) {
            if (!pred(array[idx])) {
                return false;
            }
        }
        return true;
    }
    /**
     * returns true if the value is present in the list.
     */
    function contains(array, item) {
        if (array && array.length && item) {
            return array.indexOf(item) !== -1;
        }
        return false;
    }
    /**
     * get sum from a list
     *
     * @param {Array} array - array
     * @param {Function} fn - iterator
     */
    function sum(array, fn) {
        fn = fn || func.self;
        return array.reduce(function (memo, v) {
            return memo + fn(v);
        }, 0);
    }
    /**
     * returns a copy of the collection with array type.
     * @param {Collection} collection - collection eg) node.childNodes, ...
     */
    function from(collection) {
        var result = [];
        var length = collection.length;
        var idx = -1;
        while (++idx < length) {
            result[idx] = collection[idx];
        }
        return result;
    }
    /**
     * returns whether list is empty or not
     */
    function isEmpty(array) {
        return !array || !array.length;
    }
    /**
     * cluster elements by predicate function.
     *
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     * @param {Array[]}
     */
    function clusterBy(array, fn) {
        if (!array.length) {
            return [];
        }
        var aTail = tail(array);
        return aTail.reduce(function (memo, v) {
            var aLast = last(memo);
            if (fn(last(aLast), v)) {
                aLast[aLast.length] = v;
            }
            else {
                memo[memo.length] = [v];
            }
            return memo;
        }, [[head(array)]]);
    }
    /**
     * returns a copy of the array with all false values removed
     *
     * @param {Array} array - array
     * @param {Function} fn - predicate function for cluster rule
     */
    function compact(array) {
        var aResult = [];
        for (var idx = 0, len = array.length; idx < len; idx++) {
            if (array[idx]) {
                aResult.push(array[idx]);
            }
        }
        return aResult;
    }
    /**
     * produces a duplicate-free version of the array
     *
     * @param {Array} array
     */
    function unique(array) {
        var results = [];
        for (var idx = 0, len = array.length; idx < len; idx++) {
            if (!contains(results, array[idx])) {
                results.push(array[idx]);
            }
        }
        return results;
    }
    /**
     * returns next item.
     * @param {Array} array
     */
    function next(array, item) {
        if (array && array.length && item) {
            var idx = array.indexOf(item);
            return idx === -1 ? null : array[idx + 1];
        }
        return null;
    }
    /**
     * returns prev item.
     * @param {Array} array
     */
    function prev(array, item) {
        if (array && array.length && item) {
            var idx = array.indexOf(item);
            return idx === -1 ? null : array[idx - 1];
        }
        return null;
    }
    /**
     * @class core.list
     *
     * list utils
     *
     * @singleton
     * @alternateClassName list
     */
    var lists = {
        head: head,
        last: last,
        initial: initial,
        tail: tail,
        prev: prev,
        next: next,
        find: find,
        contains: contains,
        all: all,
        sum: sum,
        from: from,
        isEmpty: isEmpty,
        clusterBy: clusterBy,
        compact: compact,
        unique: unique
    };

    var NBSP_CHAR = String.fromCharCode(160);
    var ZERO_WIDTH_NBSP_CHAR = '\ufeff';
    /**
     * @method isEditable
     *
     * returns whether node is `note-editable` or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isEditable(node) {
        return node && $$1(node).hasClass('note-editable');
    }
    /**
     * @method isControlSizing
     *
     * returns whether node is `note-control-sizing` or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isControlSizing(node) {
        return node && $$1(node).hasClass('note-control-sizing');
    }
    /**
     * @method makePredByNodeName
     *
     * returns predicate which judge whether nodeName is same
     *
     * @param {String} nodeName
     * @return {Function}
     */
    function makePredByNodeName(nodeName) {
        nodeName = nodeName.toUpperCase();
        return function (node) {
            return node && node.nodeName.toUpperCase() === nodeName;
        };
    }
    /**
     * @method isText
     *
     *
     *
     * @param {Node} node
     * @return {Boolean} true if node's type is text(3)
     */
    function isText(node) {
        return node && node.nodeType === 3;
    }
    /**
     * @method isElement
     *
     *
     *
     * @param {Node} node
     * @return {Boolean} true if node's type is element(1)
     */
    function isElement(node) {
        return node && node.nodeType === 1;
    }
    /**
     * ex) br, col, embed, hr, img, input, ...
     * @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
     */
    function isVoid(node) {
        return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
    }
    function isPara(node) {
        if (isEditable(node)) {
            return false;
        }
        // Chrome(v31.0), FF(v25.0.1) use DIV for paragraph
        return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
    }
    function isHeading(node) {
        return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
    }
    var isPre = makePredByNodeName('PRE');
    var isLi = makePredByNodeName('LI');
    function isPurePara(node) {
        return isPara(node) && !isLi(node);
    }
    var isTable = makePredByNodeName('TABLE');
    var isData = makePredByNodeName('DATA');
    function isInline(node) {
        return !isBodyContainer(node) &&
            !isList(node) &&
            !isHr(node) &&
            !isPara(node) &&
            !isTable(node) &&
            !isBlockquote(node) &&
            !isData(node);
    }
    function isList(node) {
        return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
    }
    var isHr = makePredByNodeName('HR');
    function isCell(node) {
        return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
    }
    var isBlockquote = makePredByNodeName('BLOCKQUOTE');
    function isBodyContainer(node) {
        return isCell(node) || isBlockquote(node) || isEditable(node);
    }
    var isAnchor = makePredByNodeName('A');
    function isParaInline(node) {
        return isInline(node) && !!ancestor(node, isPara);
    }
    function isBodyInline(node) {
        return isInline(node) && !ancestor(node, isPara);
    }
    var isBody = makePredByNodeName('BODY');
    /**
     * returns whether nodeB is closest sibling of nodeA
     *
     * @param {Node} nodeA
     * @param {Node} nodeB
     * @return {Boolean}
     */
    function isClosestSibling(nodeA, nodeB) {
        return nodeA.nextSibling === nodeB ||
            nodeA.previousSibling === nodeB;
    }
    /**
     * returns array of closest siblings with node
     *
     * @param {Node} node
     * @param {function} [pred] - predicate function
     * @return {Node[]}
     */
    function withClosestSiblings(node, pred) {
        pred = pred || func.ok;
        var siblings = [];
        if (node.previousSibling && pred(node.previousSibling)) {
            siblings.push(node.previousSibling);
        }
        siblings.push(node);
        if (node.nextSibling && pred(node.nextSibling)) {
            siblings.push(node.nextSibling);
        }
        return siblings;
    }
    /**
     * blank HTML for cursor position
     * - [workaround] old IE only works with &nbsp;
     * - [workaround] IE11 and other browser works with bogus br
     */
    var blankHTML = env.isMSIE && env.browserVersion < 11 ? '&nbsp;' : '<br>';
    /**
     * @method nodeLength
     *
     * returns #text's text size or element's childNodes size
     *
     * @param {Node} node
     */
    function nodeLength(node) {
        if (isText(node)) {
            return node.nodeValue.length;
        }
        if (node) {
            return node.childNodes.length;
        }
        return 0;
    }
    /**
     * returns whether node is empty or not.
     *
     * @param {Node} node
     * @return {Boolean}
     */
    function isEmpty$1(node) {
        var len = nodeLength(node);
        if (len === 0) {
            return true;
        }
        else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
            // ex) <p><br></p>, <span><br></span>
            return true;
        }
        else if (lists.all(node.childNodes, isText) && node.innerHTML === '') {
            // ex) <p></p>, <span></span>
            return true;
        }
        return false;
    }
    /**
     * padding blankHTML if node is empty (for cursor position)
     */
    function paddingBlankHTML(node) {
        if (!isVoid(node) && !nodeLength(node)) {
            node.innerHTML = blankHTML;
        }
    }
    /**
     * find nearest ancestor predicate hit
     *
     * @param {Node} node
     * @param {Function} pred - predicate function
     */
    function ancestor(node, pred) {
        while (node) {
            if (pred(node)) {
                return node;
            }
            if (isEditable(node)) {
                break;
            }
            node = node.parentNode;
        }
        return null;
    }
    /**
     * find nearest ancestor only single child blood line and predicate hit
     *
     * @param {Node} node
     * @param {Function} pred - predicate function
     */
    function singleChildAncestor(node, pred) {
        node = node.parentNode;
        while (node) {
            if (nodeLength(node) !== 1) {
                break;
            }
            if (pred(node)) {
                return node;
            }
            if (isEditable(node)) {
                break;
            }
            node = node.parentNode;
        }
        return null;
    }
    /**
     * returns new array of ancestor nodes (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [optional] pred - predicate function
     */
    function listAncestor(node, pred) {
        pred = pred || func.fail;
        var ancestors = [];
        ancestor(node, function (el) {
            if (!isEditable(el)) {
                ancestors.push(el);
            }
            return pred(el);
        });
        return ancestors;
    }
    /**
     * find farthest ancestor predicate hit
     */
    function lastAncestor(node, pred) {
        var ancestors = listAncestor(node);
        return lists.last(ancestors.filter(pred));
    }
    /**
     * returns common ancestor node between two nodes.
     *
     * @param {Node} nodeA
     * @param {Node} nodeB
     */
    function commonAncestor(nodeA, nodeB) {
        var ancestors = listAncestor(nodeA);
        for (var n = nodeB; n; n = n.parentNode) {
            if (ancestors.indexOf(n) > -1)
                return n;
        }
        return null; // difference document area
    }
    /**
     * listing all previous siblings (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [optional] pred - predicate function
     */
    function listPrev(node, pred) {
        pred = pred || func.fail;
        var nodes = [];
        while (node) {
            if (pred(node)) {
                break;
            }
            nodes.push(node);
            node = node.previousSibling;
        }
        return nodes;
    }
    /**
     * listing next siblings (until predicate hit).
     *
     * @param {Node} node
     * @param {Function} [pred] - predicate function
     */
    function listNext(node, pred) {
        pred = pred || func.fail;
        var nodes = [];
        while (node) {
            if (pred(node)) {
                break;
            }
            nodes.push(node);
            node = node.nextSibling;
        }
        return nodes;
    }
    /**
     * listing descendant nodes
     *
     * @param {Node} node
     * @param {Function} [pred] - predicate function
     */
    function listDescendant(node, pred) {
        var descendants = [];
        pred = pred || func.ok;
        // start DFS(depth first search) with node
        (function fnWalk(current) {
            if (node !== current && pred(current)) {
                descendants.push(current);
            }
            for (var idx = 0, len = current.childNodes.length; idx < len; idx++) {
                fnWalk(current.childNodes[idx]);
            }
        })(node);
        return descendants;
    }
    /**
     * wrap node with new tag.
     *
     * @param {Node} node
     * @param {Node} tagName of wrapper
     * @return {Node} - wrapper
     */
    function wrap(node, wrapperName) {
        var parent = node.parentNode;
        var wrapper = $$1('<' + wrapperName + '>')[0];
        parent.insertBefore(wrapper, node);
        wrapper.appendChild(node);
        return wrapper;
    }
    /**
     * insert node after preceding
     *
     * @param {Node} node
     * @param {Node} preceding - predicate function
     */
    function insertAfter(node, preceding) {
        var next = preceding.nextSibling;
        var parent = preceding.parentNode;
        if (next) {
            parent.insertBefore(node, next);
        }
        else {
            parent.appendChild(node);
        }
        return node;
    }
    /**
     * append elements.
     *
     * @param {Node} node
     * @param {Collection} aChild
     */
    function appendChildNodes(node, aChild) {
        $$1.each(aChild, function (idx, child) {
            node.appendChild(child);
        });
        return node;
    }
    /**
     * returns whether boundaryPoint is left edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    function isLeftEdgePoint(point) {
        return point.offset === 0;
    }
    /**
     * returns whether boundaryPoint is right edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    function isRightEdgePoint(point) {
        return point.offset === nodeLength(point.node);
    }
    /**
     * returns whether boundaryPoint is edge or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    function isEdgePoint(point) {
        return isLeftEdgePoint(point) || isRightEdgePoint(point);
    }
    /**
     * returns whether node is left edge of ancestor or not.
     *
     * @param {Node} node
     * @param {Node} ancestor
     * @return {Boolean}
     */
    function isLeftEdgeOf(node, ancestor) {
        while (node && node !== ancestor) {
            if (position(node) !== 0) {
                return false;
            }
            node = node.parentNode;
        }
        return true;
    }
    /**
     * returns whether node is right edge of ancestor or not.
     *
     * @param {Node} node
     * @param {Node} ancestor
     * @return {Boolean}
     */
    function isRightEdgeOf(node, ancestor) {
        if (!ancestor) {
            return false;
        }
        while (node && node !== ancestor) {
            if (position(node) !== nodeLength(node.parentNode) - 1) {
                return false;
            }
            node = node.parentNode;
        }
        return true;
    }
    /**
     * returns whether point is left edge of ancestor or not.
     * @param {BoundaryPoint} point
     * @param {Node} ancestor
     * @return {Boolean}
     */
    function isLeftEdgePointOf(point, ancestor) {
        return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor);
    }
    /**
     * returns whether point is right edge of ancestor or not.
     * @param {BoundaryPoint} point
     * @param {Node} ancestor
     * @return {Boolean}
     */
    function isRightEdgePointOf(point, ancestor) {
        return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor);
    }
    /**
     * returns offset from parent.
     *
     * @param {Node} node
     */
    function position(node) {
        var offset = 0;
        while ((node = node.previousSibling)) {
            offset += 1;
        }
        return offset;
    }
    function hasChildren(node) {
        return !!(node && node.childNodes && node.childNodes.length);
    }
    /**
     * returns previous boundaryPoint
     *
     * @param {BoundaryPoint} point
     * @param {Boolean} isSkipInnerOffset
     * @return {BoundaryPoint}
     */
    function prevPoint(point, isSkipInnerOffset) {
        var node;
        var offset;
        if (point.offset === 0) {
            if (isEditable(point.node)) {
                return null;
            }
            node = point.node.parentNode;
            offset = position(point.node);
        }
        else if (hasChildren(point.node)) {
            node = point.node.childNodes[point.offset - 1];
            offset = nodeLength(node);
        }
        else {
            node = point.node;
            offset = isSkipInnerOffset ? 0 : point.offset - 1;
        }
        return {
            node: node,
            offset: offset
        };
    }
    /**
     * returns next boundaryPoint
     *
     * @param {BoundaryPoint} point
     * @param {Boolean} isSkipInnerOffset
     * @return {BoundaryPoint}
     */
    function nextPoint(point, isSkipInnerOffset) {
        var node, offset;
        if (nodeLength(point.node) === point.offset) {
            if (isEditable(point.node)) {
                return null;
            }
            node = point.node.parentNode;
            offset = position(point.node) + 1;
        }
        else if (hasChildren(point.node)) {
            node = point.node.childNodes[point.offset];
            offset = 0;
        }
        else {
            node = point.node;
            offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
        }
        return {
            node: node,
            offset: offset
        };
    }
    /**
     * returns whether pointA and pointB is same or not.
     *
     * @param {BoundaryPoint} pointA
     * @param {BoundaryPoint} pointB
     * @return {Boolean}
     */
    function isSamePoint(pointA, pointB) {
        return pointA.node === pointB.node && pointA.offset === pointB.offset;
    }
    /**
     * returns whether point is visible (can set cursor) or not.
     *
     * @param {BoundaryPoint} point
     * @return {Boolean}
     */
    function isVisiblePoint(point) {
        if (isText(point.node) || !hasChildren(point.node) || isEmpty$1(point.node)) {
            return true;
        }
        var leftNode = point.node.childNodes[point.offset - 1];
        var rightNode = point.node.childNodes[point.offset];
        if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
            return true;
        }
        return false;
    }
    /**
     * @method prevPointUtil
     *
     * @param {BoundaryPoint} point
     * @param {Function} pred
     * @return {BoundaryPoint}
     */
    function prevPointUntil(point, pred) {
        while (point) {
            if (pred(point)) {
                return point;
            }
            point = prevPoint(point);
        }
        return null;
    }
    /**
     * @method nextPointUntil
     *
     * @param {BoundaryPoint} point
     * @param {Function} pred
     * @return {BoundaryPoint}
     */
    function nextPointUntil(point, pred) {
        while (point) {
            if (pred(point)) {
                return point;
            }
            point = nextPoint(point);
        }
        return null;
    }
    /**
     * returns whether point has character or not.
     *
     * @param {Point} point
     * @return {Boolean}
     */
    function isCharPoint(point) {
        if (!isText(point.node)) {
            return false;
        }
        var ch = point.node.nodeValue.charAt(point.offset - 1);
        return ch && (ch !== ' ' && ch !== NBSP_CHAR);
    }
    /**
     * @method walkPoint
     *
     * @param {BoundaryPoint} startPoint
     * @param {BoundaryPoint} endPoint
     * @param {Function} handler
     * @param {Boolean} isSkipInnerOffset
     */
    function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
        var point = startPoint;
        while (point) {
            handler(point);
            if (isSamePoint(point, endPoint)) {
                break;
            }
            var isSkipOffset = isSkipInnerOffset &&
                startPoint.node !== point.node &&
                endPoint.node !== point.node;
            point = nextPoint(point, isSkipOffset);
        }
    }
    /**
     * @method makeOffsetPath
     *
     * return offsetPath(array of offset) from ancestor
     *
     * @param {Node} ancestor - ancestor node
     * @param {Node} node
     */
    function makeOffsetPath(ancestor, node) {
        var ancestors = listAncestor(node, func.eq(ancestor));
        return ancestors.map(position).reverse();
    }
    /**
     * @method fromOffsetPath
     *
     * return element from offsetPath(array of offset)
     *
     * @param {Node} ancestor - ancestor node
     * @param {array} offsets - offsetPath
     */
    function fromOffsetPath(ancestor, offsets) {
        var current = ancestor;
        for (var i = 0, len = offsets.length; i < len; i++) {
            if (current.childNodes.length <= offsets[i]) {
                current = current.childNodes[current.childNodes.length - 1];
            }
            else {
                current = current.childNodes[offsets[i]];
            }
        }
        return current;
    }
    /**
     * @method splitNode
     *
     * split element or #text
     *
     * @param {BoundaryPoint} point
     * @param {Object} [options]
     * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
     * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
     * @param {Boolean} [options.isDiscardEmptySplits] - default: false
     * @return {Node} right node of boundaryPoint
     */
    function splitNode(point, options) {
        var isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
        var isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
        var isDiscardEmptySplits = options && options.isDiscardEmptySplits;
        if (isDiscardEmptySplits) {
            isSkipPaddingBlankHTML = true;
        }
        // edge case
        if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
            if (isLeftEdgePoint(point)) {
                return point.node;
            }
            else if (isRightEdgePoint(point)) {
                return point.node.nextSibling;
            }
        }
        // split #text
        if (isText(point.node)) {
            return point.node.splitText(point.offset);
        }
        else {
            var childNode = point.node.childNodes[point.offset];
            var clone = insertAfter(point.node.cloneNode(false), point.node);
            appendChildNodes(clone, listNext(childNode));
            if (!isSkipPaddingBlankHTML) {
                paddingBlankHTML(point.node);
                paddingBlankHTML(clone);
            }
            if (isDiscardEmptySplits) {
                if (isEmpty$1(point.node)) {
                    remove(point.node);
                }
                if (isEmpty$1(clone)) {
                    remove(clone);
                    return point.node.nextSibling;
                }
            }
            return clone;
        }
    }
    /**
     * @method splitTree
     *
     * split tree by point
     *
     * @param {Node} root - split root
     * @param {BoundaryPoint} point
     * @param {Object} [options]
     * @param {Boolean} [options.isSkipPaddingBlankHTML] - default: false
     * @param {Boolean} [options.isNotSplitEdgePoint] - default: false
     * @return {Node} right node of boundaryPoint
     */
    function splitTree(root, point, options) {
        // ex) [#text, <span>, <p>]
        var ancestors = listAncestor(point.node, func.eq(root));
        if (!ancestors.length) {
            return null;
        }
        else if (ancestors.length === 1) {
            return splitNode(point, options);
        }
        return ancestors.reduce(function (node, parent) {
            if (node === point.node) {
                node = splitNode(point, options);
            }
            return splitNode({
                node: parent,
                offset: node ? position(node) : nodeLength(parent)
            }, options);
        });
    }
    /**
     * split point
     *
     * @param {Point} point
     * @param {Boolean} isInline
     * @return {Object}
     */
    function splitPoint(point, isInline) {
        // find splitRoot, container
        //  - inline: splitRoot is a child of paragraph
        //  - block: splitRoot is a child of bodyContainer
        var pred = isInline ? isPara : isBodyContainer;
        var ancestors = listAncestor(point.node, pred);
        var topAncestor = lists.last(ancestors) || point.node;
        var splitRoot, container;
        if (pred(topAncestor)) {
            splitRoot = ancestors[ancestors.length - 2];
            container = topAncestor;
        }
        else {
            splitRoot = topAncestor;
            container = splitRoot.parentNode;
        }
        // if splitRoot is exists, split with splitTree
        var pivot = splitRoot && splitTree(splitRoot, point, {
            isSkipPaddingBlankHTML: isInline,
            isNotSplitEdgePoint: isInline
        });
        // if container is point.node, find pivot with point.offset
        if (!pivot && container === point.node) {
            pivot = point.node.childNodes[point.offset];
        }
        return {
            rightNode: pivot,
            container: container
        };
    }
    function create(nodeName) {
        return document.createElement(nodeName);
    }
    function createText(text) {
        return document.createTextNode(text);
    }
    /**
     * @method remove
     *
     * remove node, (isRemoveChild: remove child or not)
     *
     * @param {Node} node
     * @param {Boolean} isRemoveChild
     */
    function remove(node, isRemoveChild) {
        if (!node || !node.parentNode) {
            return;
        }
        if (node.removeNode) {
            return node.removeNode(isRemoveChild);
        }
        var parent = node.parentNode;
        if (!isRemoveChild) {
            var nodes = [];
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                nodes.push(node.childNodes[i]);
            }
            for (var i = 0, len = nodes.length; i < len; i++) {
                parent.insertBefore(nodes[i], node);
            }
        }
        parent.removeChild(node);
    }
    /**
     * @method removeWhile
     *
     * @param {Node} node
     * @param {Function} pred
     */
    function removeWhile(node, pred) {
        while (node) {
            if (isEditable(node) || !pred(node)) {
                break;
            }
            var parent = node.parentNode;
            remove(node);
            node = parent;
        }
    }
    /**
     * @method replace
     *
     * replace node with provided nodeName
     *
     * @param {Node} node
     * @param {String} nodeName
     * @return {Node} - new node
     */
    function replace(node, nodeName) {
        if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
            return node;
        }
        var newNode = create(nodeName);
        if (node.style.cssText) {
            newNode.style.cssText = node.style.cssText;
        }
        appendChildNodes(newNode, lists.from(node.childNodes));
        insertAfter(newNode, node);
        remove(node);
        return newNode;
    }
    var isTextarea = makePredByNodeName('TEXTAREA');
    /**
     * @param {jQuery} $node
     * @param {Boolean} [stripLinebreaks] - default: false
     */
    function value($node, stripLinebreaks) {
        var val = isTextarea($node[0]) ? $node.val() : $node.html();
        if (stripLinebreaks) {
            return val.replace(/[\n\r]/g, '');
        }
        return val;
    }
    /**
     * @method html
     *
     * get the HTML contents of node
     *
     * @param {jQuery} $node
     * @param {Boolean} [isNewlineOnBlock]
     */
    function html($node, isNewlineOnBlock) {
        var markup = value($node);
        if (isNewlineOnBlock) {
            var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
            markup = markup.replace(regexTag, function (match, endSlash, name) {
                name = name.toUpperCase();
                var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) &&
                    !!endSlash;
                var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
                return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
            });
            markup = markup.trim();
        }
        return markup;
    }
    function posFromPlaceholder(placeholder) {
        var $placeholder = $$1(placeholder);
        var pos = $placeholder.offset();
        var height = $placeholder.outerHeight(true); // include margin
        return {
            left: pos.left,
            top: pos.top + height
        };
    }
    function attachEvents($node, events) {
        Object.keys(events).forEach(function (key) {
            $node.on(key, events[key]);
        });
    }
    function detachEvents($node, events) {
        Object.keys(events).forEach(function (key) {
            $node.off(key, events[key]);
        });
    }
    /**
     * @method isCustomStyleTag
     *
     * assert if a node contains a "note-styletag" class,
     * which implies that's a custom-made style tag node
     *
     * @param {Node} an HTML DOM node
     */
    function isCustomStyleTag(node) {
        return node && !isText(node) && lists.contains(node.classList, 'note-styletag');
    }
    var dom = {
        /** @property {String} NBSP_CHAR */
        NBSP_CHAR: NBSP_CHAR,
        /** @property {String} ZERO_WIDTH_NBSP_CHAR */
        ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR,
        /** @property {String} blank */
        blank: blankHTML,
        /** @property {String} emptyPara */
        emptyPara: "<p>" + blankHTML + "</p>",
        makePredByNodeName: makePredByNodeName,
        isEditable: isEditable,
        isControlSizing: isControlSizing,
        isText: isText,
        isElement: isElement,
        isVoid: isVoid,
        isPara: isPara,
        isPurePara: isPurePara,
        isHeading: isHeading,
        isInline: isInline,
        isBlock: func.not(isInline),
        isBodyInline: isBodyInline,
        isBody: isBody,
        isParaInline: isParaInline,
        isPre: isPre,
        isList: isList,
        isTable: isTable,
        isData: isData,
        isCell: isCell,
        isBlockquote: isBlockquote,
        isBodyContainer: isBodyContainer,
        isAnchor: isAnchor,
        isDiv: makePredByNodeName('DIV'),
        isLi: isLi,
        isBR: makePredByNodeName('BR'),
        isSpan: makePredByNodeName('SPAN'),
        isB: makePredByNodeName('B'),
        isU: makePredByNodeName('U'),
        isS: makePredByNodeName('S'),
        isI: makePredByNodeName('I'),
        isImg: makePredByNodeName('IMG'),
        isTextarea: isTextarea,
        isEmpty: isEmpty$1,
        isEmptyAnchor: func.and(isAnchor, isEmpty$1),
        isClosestSibling: isClosestSibling,
        withClosestSiblings: withClosestSiblings,
        nodeLength: nodeLength,
        isLeftEdgePoint: isLeftEdgePoint,
        isRightEdgePoint: isRightEdgePoint,
        isEdgePoint: isEdgePoint,
        isLeftEdgeOf: isLeftEdgeOf,
        isRightEdgeOf: isRightEdgeOf,
        isLeftEdgePointOf: isLeftEdgePointOf,
        isRightEdgePointOf: isRightEdgePointOf,
        prevPoint: prevPoint,
        nextPoint: nextPoint,
        isSamePoint: isSamePoint,
        isVisiblePoint: isVisiblePoint,
        prevPointUntil: prevPointUntil,
        nextPointUntil: nextPointUntil,
        isCharPoint: isCharPoint,
        walkPoint: walkPoint,
        ancestor: ancestor,
        singleChildAncestor: singleChildAncestor,
        listAncestor: listAncestor,
        lastAncestor: lastAncestor,
        listNext: listNext,
        listPrev: listPrev,
        listDescendant: listDescendant,
        commonAncestor: commonAncestor,
        wrap: wrap,
        insertAfter: insertAfter,
        appendChildNodes: appendChildNodes,
        position: position,
        hasChildren: hasChildren,
        makeOffsetPath: makeOffsetPath,
        fromOffsetPath: fromOffsetPath,
        splitTree: splitTree,
        splitPoint: splitPoint,
        create: create,
        createText: createText,
        remove: remove,
        removeWhile: removeWhile,
        replace: replace,
        html: html,
        value: value,
        posFromPlaceholder: posFromPlaceholder,
        attachEvents: attachEvents,
        detachEvents: detachEvents,
        isCustomStyleTag: isCustomStyleTag
    };

    var Context = /** @class */ (function () {
        /**
         * @param {jQuery} $note
         * @param {Object} options
         */
        function Context($note, options) {
            this.ui = $$1.summernote.ui;
            this.$note = $note;
            this.memos = {};
            this.modules = {};
            this.layoutInfo = {};
            this.options = options;
            this.initialize();
        }
        /**
         * create layout and initialize modules and other resources
         */
        Context.prototype.initialize = function () {
            this.layoutInfo = this.ui.createLayout(this.$note, this.options);
            this._initialize();
            this.$note.hide();
            return this;
        };
        /**
         * destroy modules and other resources and remove layout
         */
        Context.prototype.destroy = function () {
            this._destroy();
            this.$note.removeData('summernote');
            this.ui.removeLayout(this.$note, this.layoutInfo);
        };
        /**
         * destory modules and other resources and initialize it again
         */
        Context.prototype.reset = function () {
            var disabled = this.isDisabled();
            this.code(dom.emptyPara);
            this._destroy();
            this._initialize();
            if (disabled) {
                this.disable();
            }
        };
        Context.prototype._initialize = function () {
            var _this = this;
            // add optional buttons
            var buttons = $$1.extend({}, this.options.buttons);
            Object.keys(buttons).forEach(function (key) {
                _this.memo('button.' + key, buttons[key]);
            });
            var modules = $$1.extend({}, this.options.modules, $$1.summernote.plugins || {});
            // add and initialize modules
            Object.keys(modules).forEach(function (key) {
                _this.module(key, modules[key], true);
            });
            Object.keys(this.modules).forEach(function (key) {
                _this.initializeModule(key);
            });
        };
        Context.prototype._destroy = function () {
            var _this = this;
            // destroy modules with reversed order
            Object.keys(this.modules).reverse().forEach(function (key) {
                _this.removeModule(key);
            });
            Object.keys(this.memos).forEach(function (key) {
                _this.removeMemo(key);
            });
            // trigger custom onDestroy callback
            this.triggerEvent('destroy', this);
        };
        Context.prototype.code = function (html) {
            var isActivated = this.invoke('codeview.isActivated');
            if (html === undefined) {
                this.invoke('codeview.sync');
                return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
            }
            else {
                if (isActivated) {
                    this.layoutInfo.codable.val(html);
                }
                else {
                    this.layoutInfo.editable.html(html);
                }
                this.$note.val(html);
                this.triggerEvent('change', html, this.layoutInfo.editable);
            }
        };
        Context.prototype.isDisabled = function () {
            return this.layoutInfo.editable.attr('contenteditable') === 'false';
        };
        Context.prototype.enable = function () {
            this.layoutInfo.editable.attr('contenteditable', true);
            this.invoke('toolbar.activate', true);
            this.triggerEvent('disable', false);
        };
        Context.prototype.disable = function () {
            // close codeview if codeview is opend
            if (this.invoke('codeview.isActivated')) {
                this.invoke('codeview.deactivate');
            }
            this.layoutInfo.editable.attr('contenteditable', false);
            this.invoke('toolbar.deactivate', true);
            this.triggerEvent('disable', true);
        };
        Context.prototype.triggerEvent = function () {
            var namespace = lists.head(arguments);
            var args = lists.tail(lists.from(arguments));
            var callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
            if (callback) {
                callback.apply(this.$note[0], args);
            }
            this.$note.trigger('summernote.' + namespace, args);
        };
        Context.prototype.initializeModule = function (key) {
            var module = this.modules[key];
            module.shouldInitialize = module.shouldInitialize || func.ok;
            if (!module.shouldInitialize()) {
                return;
            }
            // initialize module
            if (module.initialize) {
                module.initialize();
            }
            // attach events
            if (module.events) {
                dom.attachEvents(this.$note, module.events);
            }
        };
        Context.prototype.module = function (key, ModuleClass, withoutIntialize) {
            if (arguments.length === 1) {
                return this.modules[key];
            }
            this.modules[key] = new ModuleClass(this);
            if (!withoutIntialize) {
                this.initializeModule(key);
            }
        };
        Context.prototype.removeModule = function (key) {
            var module = this.modules[key];
            if (module.shouldInitialize()) {
                if (module.events) {
                    dom.detachEvents(this.$note, module.events);
                }
                if (module.destroy) {
                    module.destroy();
                }
            }
            delete this.modules[key];
        };
        Context.prototype.memo = function (key, obj) {
            if (arguments.length === 1) {
                return this.memos[key];
            }
            this.memos[key] = obj;
        };
        Context.prototype.removeMemo = function (key) {
            if (this.memos[key] && this.memos[key].destroy) {
                this.memos[key].destroy();
            }
            delete this.memos[key];
        };
        /**
         * Some buttons need to change their visual style immediately once they get pressed
         */
        Context.prototype.createInvokeHandlerAndUpdateState = function (namespace, value) {
            var _this = this;
            return function (event) {
                _this.createInvokeHandler(namespace, value)(event);
                _this.invoke('buttons.updateCurrentStyle');
            };
        };
        Context.prototype.createInvokeHandler = function (namespace, value) {
            var _this = this;
            return function (event) {
                event.preventDefault();
                var $target = $$1(event.target);
                _this.invoke(namespace, value || $target.closest('[data-value]').data('value'), $target);
            };
        };
        Context.prototype.invoke = function () {
            var namespace = lists.head(arguments);
            var args = lists.tail(lists.from(arguments));
            var splits = namespace.split('.');
            var hasSeparator = splits.length > 1;
            var moduleName = hasSeparator && lists.head(splits);
            var methodName = hasSeparator ? lists.last(splits) : lists.head(splits);
            var module = this.modules[moduleName || 'editor'];
            if (!moduleName && this[methodName]) {
                return this[methodName].apply(this, args);
            }
            else if (module && module[methodName] && module.shouldInitialize()) {
                return module[methodName].apply(module, args);
            }
        };
        return Context;
    }());

    $$1.fn.extend({
        /**
         * Summernote API
         *
         * @param {Object|String}
         * @return {this}
         */
        summernote: function () {
            var type = $$1.type(lists.head(arguments));
            var isExternalAPICalled = type === 'string';
            var hasInitOptions = type === 'object';
            var options = $$1.extend({}, $$1.summernote.options, hasInitOptions ? lists.head(arguments) : {});
            // Update options
            options.langInfo = $$1.extend(true, {}, $$1.summernote.lang['en-US'], $$1.summernote.lang[options.lang]);
            options.icons = $$1.extend(true, {}, $$1.summernote.options.icons, options.icons);
            options.tooltip = options.tooltip === 'auto' ? !env.isSupportTouch : options.tooltip;
            this.each(function (idx, note) {
                var $note = $$1(note);
                if (!$note.data('summernote')) {
                    var context = new Context($note, options);
                    $note.data('summernote', context);
                    $note.data('summernote').triggerEvent('init', context.layoutInfo);
                }
            });
            var $note = this.first();
            if ($note.length) {
                var context = $note.data('summernote');
                if (isExternalAPICalled) {
                    return context.invoke.apply(context, lists.from(arguments));
                }
                else if (options.focus) {
                    context.invoke('editor.focus');
                }
            }
            return this;
        }
    });

    /**
     * return boundaryPoint from TextRange, inspired by Andy Na's HuskyRange.js
     *
     * @param {TextRange} textRange
     * @param {Boolean} isStart
     * @return {BoundaryPoint}
     *
     * @see http://msdn.microsoft.com/en-us/library/ie/ms535872(v=vs.85).aspx
     */
    function textRangeToPoint(textRange, isStart) {
        var container = textRange.parentElement();
        var offset;
        var tester = document.body.createTextRange();
        var prevContainer;
        var childNodes = lists.from(container.childNodes);
        for (offset = 0; offset < childNodes.length; offset++) {
            if (dom.isText(childNodes[offset])) {
                continue;
            }
            tester.moveToElementText(childNodes[offset]);
            if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
                break;
            }
            prevContainer = childNodes[offset];
        }
        if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
            var textRangeStart = document.body.createTextRange();
            var curTextNode = null;
            textRangeStart.moveToElementText(prevContainer || container);
            textRangeStart.collapse(!prevContainer);
            curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
            var pointTester = textRange.duplicate();
            pointTester.setEndPoint('StartToStart', textRangeStart);
            var textCount = pointTester.text.replace(/[\r\n]/g, '').length;
            while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
                textCount -= curTextNode.nodeValue.length;
                curTextNode = curTextNode.nextSibling;
            }
            // [workaround] enforce IE to re-reference curTextNode, hack
            var dummy = curTextNode.nodeValue; // eslint-disable-line
            if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) &&
                textCount === curTextNode.nodeValue.length) {
                textCount -= curTextNode.nodeValue.length;
                curTextNode = curTextNode.nextSibling;
            }
            container = curTextNode;
            offset = textCount;
        }
        return {
            cont: container,
            offset: offset
        };
    }
    /**
     * return TextRange from boundary point (inspired by google closure-library)
     * @param {BoundaryPoint} point
     * @return {TextRange}
     */
    function pointToTextRange(point) {
        var textRangeInfo = function (container, offset) {
            var node, isCollapseToStart;
            if (dom.isText(container)) {
                var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
                var prevContainer = lists.last(prevTextNodes).previousSibling;
                node = prevContainer || container.parentNode;
                offset += lists.sum(lists.tail(prevTextNodes), dom.nodeLength);
                isCollapseToStart = !prevContainer;
            }
            else {
                node = container.childNodes[offset] || container;
                if (dom.isText(node)) {
                    return textRangeInfo(node, 0);
                }
                offset = 0;
                isCollapseToStart = false;
            }
            return {
                node: node,
                collapseToStart: isCollapseToStart,
                offset: offset
            };
        };
        var textRange = document.body.createTextRange();
        var info = textRangeInfo(point.node, point.offset);
        textRange.moveToElementText(info.node);
        textRange.collapse(info.collapseToStart);
        textRange.moveStart('character', info.offset);
        return textRange;
    }
    /**
       * Wrapped Range
       *
       * @constructor
       * @param {Node} sc - start container
       * @param {Number} so - start offset
       * @param {Node} ec - end container
       * @param {Number} eo - end offset
       */
    var WrappedRange = /** @class */ (function () {
        function WrappedRange(sc, so, ec, eo) {
            this.sc = sc;
            this.so = so;
            this.ec = ec;
            this.eo = eo;
            // isOnEditable: judge whether range is on editable or not
            this.isOnEditable = this.makeIsOn(dom.isEditable);
            // isOnList: judge whether range is on list node or not
            this.isOnList = this.makeIsOn(dom.isList);
            // isOnAnchor: judge whether range is on anchor node or not
            this.isOnAnchor = this.makeIsOn(dom.isAnchor);
            // isOnCell: judge whether range is on cell node or not
            this.isOnCell = this.makeIsOn(dom.isCell);
            // isOnData: judge whether range is on data node or not
            this.isOnData = this.makeIsOn(dom.isData);
        }
        // nativeRange: get nativeRange from sc, so, ec, eo
        WrappedRange.prototype.nativeRange = function () {
            if (env.isW3CRangeSupport) {
                var w3cRange = document.createRange();
                w3cRange.setStart(this.sc, this.sc.data && this.so > this.sc.data.length ? 0 : this.so);
                w3cRange.setEnd(this.ec, this.sc.data ? Math.min(this.eo, this.sc.data.length) : this.eo);
                return w3cRange;
            }
            else {
                var textRange = pointToTextRange({
                    node: this.sc,
                    offset: this.so
                });
                textRange.setEndPoint('EndToEnd', pointToTextRange({
                    node: this.ec,
                    offset: this.eo
                }));
                return textRange;
            }
        };
        WrappedRange.prototype.getPoints = function () {
            return {
                sc: this.sc,
                so: this.so,
                ec: this.ec,
                eo: this.eo
            };
        };
        WrappedRange.prototype.getStartPoint = function () {
            return {
                node: this.sc,
                offset: this.so
            };
        };
        WrappedRange.prototype.getEndPoint = function () {
            return {
                node: this.ec,
                offset: this.eo
            };
        };
        /**
         * select update visible range
         */
        WrappedRange.prototype.select = function () {
            var nativeRng = this.nativeRange();
            if (env.isW3CRangeSupport) {
                var selection = document.getSelection();
                if (selection.rangeCount > 0) {
                    selection.removeAllRanges();
                }
                selection.addRange(nativeRng);
            }
            else {
                nativeRng.select();
            }
            return this;
        };
        /**
         * Moves the scrollbar to start container(sc) of current range
         *
         * @return {WrappedRange}
         */
        WrappedRange.prototype.scrollIntoView = function (container) {
            var height = $$1(container).height();
            if (container.scrollTop + height < this.sc.offsetTop) {
                container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
            }
            return this;
        };
        /**
         * @return {WrappedRange}
         */
        WrappedRange.prototype.normalize = function () {
            /**
             * @param {BoundaryPoint} point
             * @param {Boolean} isLeftToRight - true: prefer to choose right node
             *                                - false: prefer to choose left node
             * @return {BoundaryPoint}
             */
            var getVisiblePoint = function (point, isLeftToRight) {
                // Just use the given point [XXX:Adhoc]
                //  - case 01. if the point is on the middle of the node
                //  - case 02. if the point is on the right edge and prefer to choose left node
                //  - case 03. if the point is on the left edge and prefer to choose right node
                //  - case 04. if the point is on the right edge and prefer to choose right node but the node is void
                //  - case 05. if the point is on the left edge and prefer to choose left node but the node is void
                //  - case 06. if the point is on the block node and there is no children
                if (dom.isVisiblePoint(point)) {
                    if (!dom.isEdgePoint(point) ||
                        (dom.isRightEdgePoint(point) && !isLeftToRight) ||
                        (dom.isLeftEdgePoint(point) && isLeftToRight) ||
                        (dom.isRightEdgePoint(point) && isLeftToRight && dom.isVoid(point.node.nextSibling)) ||
                        (dom.isLeftEdgePoint(point) && !isLeftToRight && dom.isVoid(point.node.previousSibling)) ||
                        (dom.isBlock(point.node) && dom.isEmpty(point.node))) {
                        return point;
                    }
                }
                // point on block's edge
                var block = dom.ancestor(point.node, dom.isBlock);
                if (((dom.isLeftEdgePointOf(point, block) || dom.isVoid(dom.prevPoint(point).node)) && !isLeftToRight) ||
                    ((dom.isRightEdgePointOf(point, block) || dom.isVoid(dom.nextPoint(point).node)) && isLeftToRight)) {
                    // returns point already on visible point
                    if (dom.isVisiblePoint(point)) {
                        return point;
                    }
                    // reverse direction
                    isLeftToRight = !isLeftToRight;
                }
                var nextPoint = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint)
                    : dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
                return nextPoint || point;
            };
            var endPoint = getVisiblePoint(this.getEndPoint(), false);
            var startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);
            return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
        };
        /**
         * returns matched nodes on range
         *
         * @param {Function} [pred] - predicate function
         * @param {Object} [options]
         * @param {Boolean} [options.includeAncestor]
         * @param {Boolean} [options.fullyContains]
         * @return {Node[]}
         */
        WrappedRange.prototype.nodes = function (pred, options) {
            pred = pred || func.ok;
            var includeAncestor = options && options.includeAncestor;
            var fullyContains = options && options.fullyContains;
            // TODO compare points and sort
            var startPoint = this.getStartPoint();
            var endPoint = this.getEndPoint();
            var nodes = [];
            var leftEdgeNodes = [];
            dom.walkPoint(startPoint, endPoint, function (point) {
                if (dom.isEditable(point.node)) {
                    return;
                }
                var node;
                if (fullyContains) {
                    if (dom.isLeftEdgePoint(point)) {
                        leftEdgeNodes.push(point.node);
                    }
                    if (dom.isRightEdgePoint(point) && lists.contains(leftEdgeNodes, point.node)) {
                        node = point.node;
                    }
                }
                else if (includeAncestor) {
                    node = dom.ancestor(point.node, pred);
                }
                else {
                    node = point.node;
                }
                if (node && pred(node)) {
                    nodes.push(node);
                }
            }, true);
            return lists.unique(nodes);
        };
        /**
         * returns commonAncestor of range
         * @return {Element} - commonAncestor
         */
        WrappedRange.prototype.commonAncestor = function () {
            return dom.commonAncestor(this.sc, this.ec);
        };
        /**
         * returns expanded range by pred
         *
         * @param {Function} pred - predicate function
         * @return {WrappedRange}
         */
        WrappedRange.prototype.expand = function (pred) {
            var startAncestor = dom.ancestor(this.sc, pred);
            var endAncestor = dom.ancestor(this.ec, pred);
            if (!startAncestor && !endAncestor) {
                return new WrappedRange(this.sc, this.so, this.ec, this.eo);
            }
            var boundaryPoints = this.getPoints();
            if (startAncestor) {
                boundaryPoints.sc = startAncestor;
                boundaryPoints.so = 0;
            }
            if (endAncestor) {
                boundaryPoints.ec = endAncestor;
                boundaryPoints.eo = dom.nodeLength(endAncestor);
            }
            return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
        };
        /**
         * @param {Boolean} isCollapseToStart
         * @return {WrappedRange}
         */
        WrappedRange.prototype.collapse = function (isCollapseToStart) {
            if (isCollapseToStart) {
                return new WrappedRange(this.sc, this.so, this.sc, this.so);
            }
            else {
                return new WrappedRange(this.ec, this.eo, this.ec, this.eo);
            }
        };
        /**
         * splitText on range
         */
        WrappedRange.prototype.splitText = function () {
            var isSameContainer = this.sc === this.ec;
            var boundaryPoints = this.getPoints();
            if (dom.isText(this.ec) && !dom.isEdgePoint(this.getEndPoint())) {
                this.ec.splitText(this.eo);
            }
            if (dom.isText(this.sc) && !dom.isEdgePoint(this.getStartPoint())) {
                boundaryPoints.sc = this.sc.splitText(this.so);
                boundaryPoints.so = 0;
                if (isSameContainer) {
                    boundaryPoints.ec = boundaryPoints.sc;
                    boundaryPoints.eo = this.eo - this.so;
                }
            }
            return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
        };
        /**
         * delete contents on range
         * @return {WrappedRange}
         */
        WrappedRange.prototype.deleteContents = function () {
            if (this.isCollapsed()) {
                return this;
            }
            var rng = this.splitText();
            var nodes = rng.nodes(null, {
                fullyContains: true
            });
            // find new cursor point
            var point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
                return !lists.contains(nodes, point.node);
            });
            var emptyParents = [];
            $$1.each(nodes, function (idx, node) {
                // find empty parents
                var parent = node.parentNode;
                if (point.node !== parent && dom.nodeLength(parent) === 1) {
                    emptyParents.push(parent);
                }
                dom.remove(node, false);
            });
            // remove empty parents
            $$1.each(emptyParents, function (idx, node) {
                dom.remove(node, false);
            });
            return new WrappedRange(point.node, point.offset, point.node, point.offset).normalize();
        };
        /**
         * makeIsOn: return isOn(pred) function
         */
        WrappedRange.prototype.makeIsOn = function (pred) {
            return function () {
                var ancestor = dom.ancestor(this.sc, pred);
                return !!ancestor && (ancestor === dom.ancestor(this.ec, pred));
            };
        };
        /**
         * @param {Function} pred
         * @return {Boolean}
         */
        WrappedRange.prototype.isLeftEdgeOf = function (pred) {
            if (!dom.isLeftEdgePoint(this.getStartPoint())) {
                return false;
            }
            var node = dom.ancestor(this.sc, pred);
            return node && dom.isLeftEdgeOf(this.sc, node);
        };
        /**
         * returns whether range was collapsed or not
         */
        WrappedRange.prototype.isCollapsed = function () {
            return this.sc === this.ec && this.so === this.eo;
        };
        /**
         * wrap inline nodes which children of body with paragraph
         *
         * @return {WrappedRange}
         */
        WrappedRange.prototype.wrapBodyInlineWithPara = function () {
            if (dom.isBodyContainer(this.sc) && dom.isEmpty(this.sc)) {
                this.sc.innerHTML = dom.emptyPara;
                return new WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
            }
            /**
             * [workaround] firefox often create range on not visible point. so normalize here.
             *  - firefox: |<p>text</p>|
             *  - chrome: <p>|text|</p>
             */
            var rng = this.normalize();
            if (dom.isParaInline(this.sc) || dom.isPara(this.sc)) {
                return rng;
            }
            // find inline top ancestor
            var topAncestor;
            if (dom.isInline(rng.sc)) {
                var ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
                topAncestor = lists.last(ancestors);
                if (!dom.isInline(topAncestor)) {
                    topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
                }
            }
            else {
                topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
            }
            // siblings not in paragraph
            var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
            inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));
            // wrap with paragraph
            if (inlineSiblings.length) {
                var para = dom.wrap(lists.head(inlineSiblings), 'p');
                dom.appendChildNodes(para, lists.tail(inlineSiblings));
            }
            return this.normalize();
        };
        /**
         * insert node at current cursor
         *
         * @param {Node} node
         * @return {Node}
         */
        WrappedRange.prototype.insertNode = function (node) {
            var rng = this.wrapBodyInlineWithPara().deleteContents();
            var info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));
            if (info.rightNode) {
                info.rightNode.parentNode.insertBefore(node, info.rightNode);
            }
            else {
                info.container.appendChild(node);
            }
            return node;
        };
        /**
         * insert html at current cursor
         */
        WrappedRange.prototype.pasteHTML = function (markup) {
            var contentsContainer = $$1('<div></div>').html(markup)[0];
            var childNodes = lists.from(contentsContainer.childNodes);
            var rng = this.wrapBodyInlineWithPara().deleteContents();
            if (rng.so > 0) {
                childNodes = childNodes.reverse();
            }
            childNodes = childNodes.map(function (childNode) {
                return rng.insertNode(childNode);
            });
            if (rng.so > 0) {
                childNodes = childNodes.reverse();
            }
            return childNodes;
        };
        /**
         * returns text in range
         *
         * @return {String}
         */
        WrappedRange.prototype.toString = function () {
            var nativeRng = this.nativeRange();
            return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
        };
        /**
         * returns range for word before cursor
         *
         * @param {Boolean} [findAfter] - find after cursor, default: false
         * @return {WrappedRange}
         */
        WrappedRange.prototype.getWordRange = function (findAfter) {
            var endPoint = this.getEndPoint();
            if (!dom.isCharPoint(endPoint)) {
                return this;
            }
            var startPoint = dom.prevPointUntil(endPoint, function (point) {
                return !dom.isCharPoint(point);
            });
            if (findAfter) {
                endPoint = dom.nextPointUntil(endPoint, function (point) {
                    return !dom.isCharPoint(point);
                });
            }
            return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
        };
        /**
         * create offsetPath bookmark
         *
         * @param {Node} editable
         */
        WrappedRange.prototype.bookmark = function (editable) {
            return {
                s: {
                    path: dom.makeOffsetPath(editable, this.sc),
                    offset: this.so
                },
                e: {
                    path: dom.makeOffsetPath(editable, this.ec),
                    offset: this.eo
                }
            };
        };
        /**
         * create offsetPath bookmark base on paragraph
         *
         * @param {Node[]} paras
         */
        WrappedRange.prototype.paraBookmark = function (paras) {
            return {
                s: {
                    path: lists.tail(dom.makeOffsetPath(lists.head(paras), this.sc)),
                    offset: this.so
                },
                e: {
                    path: lists.tail(dom.makeOffsetPath(lists.last(paras), this.ec)),
                    offset: this.eo
                }
            };
        };
        /**
         * getClientRects
         * @return {Rect[]}
         */
        WrappedRange.prototype.getClientRects = function () {
            var nativeRng = this.nativeRange();
            return nativeRng.getClientRects();
        };
        return WrappedRange;
    }());
    /**
     * Data structure
     *  * BoundaryPoint: a point of dom tree
     *  * BoundaryPoints: two boundaryPoints corresponding to the start and the end of the Range
     *
     * See to http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Position
     */
    var range = {
        /**
         * create Range Object From arguments or Browser Selection
         *
         * @param {Node} sc - start container
         * @param {Number} so - start offset
         * @param {Node} ec - end container
         * @param {Number} eo - end offset
         * @return {WrappedRange}
         */
        create: function (sc, so, ec, eo) {
            if (arguments.length === 4) {
                return new WrappedRange(sc, so, ec, eo);
            }
            else if (arguments.length === 2) { // collapsed
                ec = sc;
                eo = so;
                return new WrappedRange(sc, so, ec, eo);
            }
            else {
                var wrappedRange = this.createFromSelection();
                if (!wrappedRange && arguments.length === 1) {
                    wrappedRange = this.createFromNode(arguments[0]);
                    return wrappedRange.collapse(dom.emptyPara === arguments[0].innerHTML);
                }
                return wrappedRange;
            }
        },
        createFromSelection: function () {
            var sc, so, ec, eo;
            if (env.isW3CRangeSupport) {
                var selection = document.getSelection();
                if (!selection || selection.rangeCount === 0) {
                    return null;
                }
                else if (dom.isBody(selection.anchorNode)) {
                    // Firefox: returns entire body as range on initialization.
                    // We won't never need it.
                    return null;
                }
                var nativeRng = selection.getRangeAt(0);
                sc = nativeRng.startContainer;
                so = nativeRng.startOffset;
                ec = nativeRng.endContainer;
                eo = nativeRng.endOffset;
            }
            else { // IE8: TextRange
                var textRange = document.selection.createRange();
                var textRangeEnd = textRange.duplicate();
                textRangeEnd.collapse(false);
                var textRangeStart = textRange;
                textRangeStart.collapse(true);
                var startPoint = textRangeToPoint(textRangeStart, true);
                var endPoint = textRangeToPoint(textRangeEnd, false);
                // same visible point case: range was collapsed.
                if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) &&
                    dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) &&
                    endPoint.node.nextSibling === startPoint.node) {
                    startPoint = endPoint;
                }
                sc = startPoint.cont;
                so = startPoint.offset;
                ec = endPoint.cont;
                eo = endPoint.offset;
            }
            return new WrappedRange(sc, so, ec, eo);
        },
        /**
         * @method
         *
         * create WrappedRange from node
         *
         * @param {Node} node
         * @return {WrappedRange}
         */
        createFromNode: function (node) {
            var sc = node;
            var so = 0;
            var ec = node;
            var eo = dom.nodeLength(ec);
            // browsers can't target a picture or void node
            if (dom.isVoid(sc)) {
                so = dom.listPrev(sc).length - 1;
                sc = sc.parentNode;
            }
            if (dom.isBR(ec)) {
                eo = dom.listPrev(ec).length - 1;
                ec = ec.parentNode;
            }
            else if (dom.isVoid(ec)) {
                eo = dom.listPrev(ec).length;
                ec = ec.parentNode;
            }
            return this.create(sc, so, ec, eo);
        },
        /**
         * create WrappedRange from node after position
         *
         * @param {Node} node
         * @return {WrappedRange}
         */
        createFromNodeBefore: function (node) {
            return this.createFromNode(node).collapse(true);
        },
        /**
         * create WrappedRange from node after position
         *
         * @param {Node} node
         * @return {WrappedRange}
         */
        createFromNodeAfter: function (node) {
            return this.createFromNode(node).collapse();
        },
        /**
         * @method
         *
         * create WrappedRange from bookmark
         *
         * @param {Node} editable
         * @param {Object} bookmark
         * @return {WrappedRange}
         */
        createFromBookmark: function (editable, bookmark) {
            var sc = dom.fromOffsetPath(editable, bookmark.s.path);
            var so = bookmark.s.offset;
            var ec = dom.fromOffsetPath(editable, bookmark.e.path);
            var eo = bookmark.e.offset;
            return new WrappedRange(sc, so, ec, eo);
        },
        /**
         * @method
         *
         * create WrappedRange from paraBookmark
         *
         * @param {Object} bookmark
         * @param {Node[]} paras
         * @return {WrappedRange}
         */
        createFromParaBookmark: function (bookmark, paras) {
            var so = bookmark.s.offset;
            var eo = bookmark.e.offset;
            var sc = dom.fromOffsetPath(lists.head(paras), bookmark.s.path);
            var ec = dom.fromOffsetPath(lists.last(paras), bookmark.e.path);
            return new WrappedRange(sc, so, ec, eo);
        }
    };

    var KEY_MAP = {
        'BACKSPACE': 8,
        'TAB': 9,
        'ENTER': 13,
        'SPACE': 32,
        'DELETE': 46,
        // Arrow
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,
        // Number: 0-9
        'NUM0': 48,
        'NUM1': 49,
        'NUM2': 50,
        'NUM3': 51,
        'NUM4': 52,
        'NUM5': 53,
        'NUM6': 54,
        'NUM7': 55,
        'NUM8': 56,
        // Alphabet: a-z
        'B': 66,
        'E': 69,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'R': 82,
        'S': 83,
        'U': 85,
        'V': 86,
        'Y': 89,
        'Z': 90,
        'SLASH': 191,
        'LEFTBRACKET': 219,
        'BACKSLASH': 220,
        'RIGHTBRACKET': 221
    };
    /**
     * @class core.key
     *
     * Object for keycodes.
     *
     * @singleton
     * @alternateClassName key
     */
    var key = {
        /**
         * @method isEdit
         *
         * @param {Number} keyCode
         * @return {Boolean}
         */
        isEdit: function (keyCode) {
            return lists.contains([
                KEY_MAP.BACKSPACE,
                KEY_MAP.TAB,
                KEY_MAP.ENTER,
                KEY_MAP.SPACE,
                KEY_MAP.DELETE,
            ], keyCode);
        },
        /**
         * @method isMove
         *
         * @param {Number} keyCode
         * @return {Boolean}
         */
        isMove: function (keyCode) {
            return lists.contains([
                KEY_MAP.LEFT,
                KEY_MAP.UP,
                KEY_MAP.RIGHT,
                KEY_MAP.DOWN,
            ], keyCode);
        },
        /**
         * @property {Object} nameFromCode
         * @property {String} nameFromCode.8 "BACKSPACE"
         */
        nameFromCode: func.invertObject(KEY_MAP),
        code: KEY_MAP
    };

    /**
     * @method readFileAsDataURL
     *
     * read contents of file as representing URL
     *
     * @param {File} file
     * @return {Promise} - then: dataUrl
     */
    function readFileAsDataURL(file) {
        return $$1.Deferred(function (deferred) {
            $$1.extend(new FileReader(), {
                onload: function (e) {
                    var dataURL = e.target.result;
                    deferred.resolve(dataURL);
                },
                onerror: function (err) {
                    deferred.reject(err);
                }
            }).readAsDataURL(file);
        }).promise();
    }
    /**
     * @method createImage
     *
     * create `<image>` from url string
     *
     * @param {String} url
     * @return {Promise} - then: $image
     */
    function createImage(url) {
        return $$1.Deferred(function (deferred) {
            var $img = $$1('<img>');
            $img.one('load', function () {
                $img.off('error abort');
                deferred.resolve($img);
            }).one('error abort', function () {
                $img.off('load').detach();
                deferred.reject($img);
            }).css({
                display: 'none'
            }).appendTo(document.body).attr('src', url);
        }).promise();
    }

    var History = /** @class */ (function () {
        function History($editable) {
            this.stack = [];
            this.stackOffset = -1;
            this.$editable = $editable;
            this.editable = $editable[0];
        }
        History.prototype.makeSnapshot = function () {
            var rng = range.create(this.editable);
            var emptyBookmark = { s: { path: [], offset: 0 }, e: { path: [], offset: 0 } };
            return {
                contents: this.$editable.html(),
                bookmark: ((rng && rng.isOnEditable()) ? rng.bookmark(this.editable) : emptyBookmark)
            };
        };
        History.prototype.applySnapshot = function (snapshot) {
            if (snapshot.contents !== null) {
                this.$editable.html(snapshot.contents);
            }
            if (snapshot.bookmark !== null) {
                range.createFromBookmark(this.editable, snapshot.bookmark).select();
            }
        };
        /**
        * @method rewind
        * Rewinds the history stack back to the first snapshot taken.
        * Leaves the stack intact, so that "Redo" can still be used.
        */
        History.prototype.rewind = function () {
            // Create snap shot if not yet recorded
            if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
                this.recordUndo();
            }
            // Return to the first available snapshot.
            this.stackOffset = 0;
            // Apply that snapshot.
            this.applySnapshot(this.stack[this.stackOffset]);
        };
        /**
        *  @method commit
        *  Resets history stack, but keeps current editor's content.
        */
        History.prototype.commit = function () {
            // Clear the stack.
            this.stack = [];
            // Restore stackOffset to its original value.
            this.stackOffset = -1;
            // Record our first snapshot (of nothing).
            this.recordUndo();
        };
        /**
        * @method reset
        * Resets the history stack completely; reverting to an empty editor.
        */
        History.prototype.reset = function () {
            // Clear the stack.
            this.stack = [];
            // Restore stackOffset to its original value.
            this.stackOffset = -1;
            // Clear the editable area.
            this.$editable.html('');
            // Record our first snapshot (of nothing).
            this.recordUndo();
        };
        /**
         * undo
         */
        History.prototype.undo = function () {
            // Create snap shot if not yet recorded
            if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
                this.recordUndo();
            }
            if (this.stackOffset > 0) {
                this.stackOffset--;
                this.applySnapshot(this.stack[this.stackOffset]);
            }
        };
        /**
         * redo
         */
        History.prototype.redo = function () {
            if (this.stack.length - 1 > this.stackOffset) {
                this.stackOffset++;
                this.applySnapshot(this.stack[this.stackOffset]);
            }
        };
        /**
         * recorded undo
         */
        History.prototype.recordUndo = function () {
            this.stackOffset++;
            // Wash out stack after stackOffset
            if (this.stack.length > this.stackOffset) {
                this.stack = this.stack.slice(0, this.stackOffset);
            }
            // Create new snapshot and push it to the end
            this.stack.push(this.makeSnapshot());
        };
        return History;
    }());

    var Style = /** @class */ (function () {
        function Style() {
        }
        /**
         * @method jQueryCSS
         *
         * [workaround] for old jQuery
         * passing an array of style properties to .css()
         * will result in an object of property-value pairs.
         * (compability with version < 1.9)
         *
         * @private
         * @param  {jQuery} $obj
         * @param  {Array} propertyNames - An array of one or more CSS properties.
         * @return {Object}
         */
        Style.prototype.jQueryCSS = function ($obj, propertyNames) {
            if (env.jqueryVersion < 1.9) {
                var result_1 = {};
                $$1.each(propertyNames, function (idx, propertyName) {
                    result_1[propertyName] = $obj.css(propertyName);
                });
                return result_1;
            }
            return $obj.css(propertyNames);
        };
        /**
         * returns style object from node
         *
         * @param {jQuery} $node
         * @return {Object}
         */
        Style.prototype.fromNode = function ($node) {
            var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
            var styleInfo = this.jQueryCSS($node, properties) || {};
            styleInfo['font-size'] = parseInt(styleInfo['font-size'], 10);
            return styleInfo;
        };
        /**
         * paragraph level style
         *
         * @param {WrappedRange} rng
         * @param {Object} styleInfo
         */
        Style.prototype.stylePara = function (rng, styleInfo) {
            $$1.each(rng.nodes(dom.isPara, {
                includeAncestor: true
            }), function (idx, para) {
                $$1(para).css(styleInfo);
            });
        };
        /**
         * insert and returns styleNodes on range.
         *
         * @param {WrappedRange} rng
         * @param {Object} [options] - options for styleNodes
         * @param {String} [options.nodeName] - default: `SPAN`
         * @param {Boolean} [options.expandClosestSibling] - default: `false`
         * @param {Boolean} [options.onlyPartialContains] - default: `false`
         * @return {Node[]}
         */
        Style.prototype.styleNodes = function (rng, options) {
            rng = rng.splitText();
            var nodeName = (options && options.nodeName) || 'SPAN';
            var expandClosestSibling = !!(options && options.expandClosestSibling);
            var onlyPartialContains = !!(options && options.onlyPartialContains);
            if (rng.isCollapsed()) {
                return [rng.insertNode(dom.create(nodeName))];
            }
            var pred = dom.makePredByNodeName(nodeName);
            var nodes = rng.nodes(dom.isText, {
                fullyContains: true
            }).map(function (text) {
                return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
            });
            if (expandClosestSibling) {
                if (onlyPartialContains) {
                    var nodesInRange_1 = rng.nodes();
                    // compose with partial contains predication
                    pred = func.and(pred, function (node) {
                        return lists.contains(nodesInRange_1, node);
                    });
                }
                return nodes.map(function (node) {
                    var siblings = dom.withClosestSiblings(node, pred);
                    var head = lists.head(siblings);
                    var tails = lists.tail(siblings);
                    $$1.each(tails, function (idx, elem) {
                        dom.appendChildNodes(head, elem.childNodes);
                        dom.remove(elem);
                    });
                    return lists.head(siblings);
                });
            }
            else {
                return nodes;
            }
        };
        /**
         * get current style on cursor
         *
         * @param {WrappedRange} rng
         * @return {Object} - object contains style properties.
         */
        Style.prototype.current = function (rng) {
            var $cont = $$1(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
            var styleInfo = this.fromNode($cont);
            // document.queryCommandState for toggle state
            // [workaround] prevent Firefox nsresult: "0x80004005 (NS_ERROR_FAILURE)"
            try {
                styleInfo = $$1.extend(styleInfo, {
                    'font-bold': document.queryCommandState('bold') ? 'bold' : 'normal',
                    'font-italic': document.queryCommandState('italic') ? 'italic' : 'normal',
                    'font-underline': document.queryCommandState('underline') ? 'underline' : 'normal',
                    'font-subscript': document.queryCommandState('subscript') ? 'subscript' : 'normal',
                    'font-superscript': document.queryCommandState('superscript') ? 'superscript' : 'normal',
                    'font-strikethrough': document.queryCommandState('strikethrough') ? 'strikethrough' : 'normal',
                    'font-family': document.queryCommandValue('fontname') || styleInfo['font-family']
                });
            }
            catch (e) { }
            // list-style-type to list-style(unordered, ordered)
            if (!rng.isOnList()) {
                styleInfo['list-style'] = 'none';
            }
            else {
                var orderedTypes = ['circle', 'disc', 'disc-leading-zero', 'square'];
                var isUnordered = orderedTypes.indexOf(styleInfo['list-style-type']) > -1;
                styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
            }
            var para = dom.ancestor(rng.sc, dom.isPara);
            if (para && para.style['line-height']) {
                styleInfo['line-height'] = para.style.lineHeight;
            }
            else {
                var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
                styleInfo['line-height'] = lineHeight.toFixed(1);
            }
            styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
            styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
            styleInfo.range = rng;
            return styleInfo;
        };
        return Style;
    }());

    var Bullet = /** @class */ (function () {
        function Bullet() {
        }
        /**
         * toggle ordered list
         */
        Bullet.prototype.insertOrderedList = function (editable) {
            this.toggleList('OL', editable);
        };
        /**
         * toggle unordered list
         */
        Bullet.prototype.insertUnorderedList = function (editable) {
            this.toggleList('UL', editable);
        };
        /**
         * indent
         */
        Bullet.prototype.indent = function (editable) {
            var _this = this;
            var rng = range.create(editable).wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, { includeAncestor: true });
            var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
            $$1.each(clustereds, function (idx, paras) {
                var head = lists.head(paras);
                if (dom.isLi(head)) {
                    var previousList_1 = _this.findList(head.previousSibling);
                    if (previousList_1) {
                        paras
                            .map(function (para) { return previousList_1.appendChild(para); });
                    }
                    else {
                        _this.wrapList(paras, head.parentNode.nodeName);
                        paras
                            .map(function (para) { return para.parentNode; })
                            .map(function (para) { return _this.appendToPrevious(para); });
                    }
                }
                else {
                    $$1.each(paras, function (idx, para) {
                        $$1(para).css('marginLeft', function (idx, val) {
                            return (parseInt(val, 10) || 0) + 25;
                        });
                    });
                }
            });
            rng.select();
        };
        /**
         * outdent
         */
        Bullet.prototype.outdent = function (editable) {
            var _this = this;
            var rng = range.create(editable).wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, { includeAncestor: true });
            var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
            $$1.each(clustereds, function (idx, paras) {
                var head = lists.head(paras);
                if (dom.isLi(head)) {
                    _this.releaseList([paras]);
                }
                else {
                    $$1.each(paras, function (idx, para) {
                        $$1(para).css('marginLeft', function (idx, val) {
                            val = (parseInt(val, 10) || 0);
                            return val > 25 ? val - 25 : '';
                        });
                    });
                }
            });
            rng.select();
        };
        /**
         * toggle list
         *
         * @param {String} listName - OL or UL
         */
        Bullet.prototype.toggleList = function (listName, editable) {
            var _this = this;
            var rng = range.create(editable).wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, { includeAncestor: true });
            var bookmark = rng.paraBookmark(paras);
            var clustereds = lists.clusterBy(paras, func.peq2('parentNode'));
            // paragraph to list
            if (lists.find(paras, dom.isPurePara)) {
                var wrappedParas_1 = [];
                $$1.each(clustereds, function (idx, paras) {
                    wrappedParas_1 = wrappedParas_1.concat(_this.wrapList(paras, listName));
                });
                paras = wrappedParas_1;
                // list to paragraph or change list style
            }
            else {
                var diffLists = rng.nodes(dom.isList, {
                    includeAncestor: true
                }).filter(function (listNode) {
                    return !$$1.nodeName(listNode, listName);
                });
                if (diffLists.length) {
                    $$1.each(diffLists, function (idx, listNode) {
                        dom.replace(listNode, listName);
                    });
                }
                else {
                    paras = this.releaseList(clustereds, true);
                }
            }
            range.createFromParaBookmark(bookmark, paras).select();
        };
        /**
         * @param {Node[]} paras
         * @param {String} listName
         * @return {Node[]}
         */
        Bullet.prototype.wrapList = function (paras, listName) {
            var head = lists.head(paras);
            var last = lists.last(paras);
            var prevList = dom.isList(head.previousSibling) && head.previousSibling;
            var nextList = dom.isList(last.nextSibling) && last.nextSibling;
            var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);
            // P to LI
            paras = paras.map(function (para) {
                return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
            });
            // append to list(<ul>, <ol>)
            dom.appendChildNodes(listNode, paras);
            if (nextList) {
                dom.appendChildNodes(listNode, lists.from(nextList.childNodes));
                dom.remove(nextList);
            }
            return paras;
        };
        /**
         * @method releaseList
         *
         * @param {Array[]} clustereds
         * @param {Boolean} isEscapseToBody
         * @return {Node[]}
         */
        Bullet.prototype.releaseList = function (clustereds, isEscapseToBody) {
            var _this = this;
            var releasedParas = [];
            $$1.each(clustereds, function (idx, paras) {
                var head = lists.head(paras);
                var last = lists.last(paras);
                var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
                var parentItem = headList.parentNode;
                if (headList.parentNode.nodeName === 'LI') {
                    paras.map(function (para) {
                        var newList = _this.findNextSiblings(para);
                        if (parentItem.nextSibling) {
                            parentItem.parentNode.insertBefore(para, parentItem.nextSibling);
                        }
                        else {
                            parentItem.parentNode.appendChild(para);
                        }
                        if (newList.length) {
                            _this.wrapList(newList, headList.nodeName);
                            para.appendChild(newList[0].parentNode);
                        }
                    });
                    if (headList.children.length === 0) {
                        parentItem.removeChild(headList);
                    }
                    if (parentItem.childNodes.length === 0) {
                        parentItem.parentNode.removeChild(parentItem);
                    }
                }
                else {
                    var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {
                        node: last.parentNode,
                        offset: dom.position(last) + 1
                    }, {
                        isSkipPaddingBlankHTML: true
                    }) : null;
                    var middleList = dom.splitTree(headList, {
                        node: head.parentNode,
                        offset: dom.position(head)
                    }, {
                        isSkipPaddingBlankHTML: true
                    });
                    paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi)
                        : lists.from(middleList.childNodes).filter(dom.isLi);
                    // LI to P
                    if (isEscapseToBody || !dom.isList(headList.parentNode)) {
                        paras = paras.map(function (para) {
                            return dom.replace(para, 'P');
                        });
                    }
                    $$1.each(lists.from(paras).reverse(), function (idx, para) {
                        dom.insertAfter(para, headList);
                    });
                    // remove empty lists
                    var rootLists = lists.compact([headList, middleList, lastList]);
                    $$1.each(rootLists, function (idx, rootList) {
                        var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
                        $$1.each(listNodes.reverse(), function (idx, listNode) {
                            if (!dom.nodeLength(listNode)) {
                                dom.remove(listNode, true);
                            }
                        });
                    });
                }
                releasedParas = releasedParas.concat(paras);
            });
            return releasedParas;
        };
        /**
         * @method appendToPrevious
         *
         * Appends list to previous list item, if
         * none exist it wraps the list in a new list item.
         *
         * @param {HTMLNode} ListItem
         * @return {HTMLNode}
         */
        Bullet.prototype.appendToPrevious = function (node) {
            return node.previousSibling
                ? dom.appendChildNodes(node.previousSibling, [node])
                : this.wrapList([node], 'LI');
        };
        /**
         * @method findList
         *
         * Finds an existing list in list item
         *
         * @param {HTMLNode} ListItem
         * @return {Array[]}
         */
        Bullet.prototype.findList = function (node) {
            return node
                ? lists.find(node.children, function (child) { return ['OL', 'UL'].indexOf(child.nodeName) > -1; })
                : null;
        };
        /**
         * @method findNextSiblings
         *
         * Finds all list item siblings that follow it
         *
         * @param {HTMLNode} ListItem
         * @return {HTMLNode}
         */
        Bullet.prototype.findNextSiblings = function (node) {
            var siblings = [];
            while (node.nextSibling) {
                siblings.push(node.nextSibling);
                node = node.nextSibling;
            }
            return siblings;
        };
        return Bullet;
    }());

    /**
     * @class editing.Typing
     *
     * Typing
     *
     */
    var Typing = /** @class */ (function () {
        function Typing(context) {
            // a Bullet instance to toggle lists off
            this.bullet = new Bullet();
            this.options = context.options;
        }
        /**
         * insert tab
         *
         * @param {WrappedRange} rng
         * @param {Number} tabsize
         */
        Typing.prototype.insertTab = function (rng, tabsize) {
            var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
            rng = rng.deleteContents();
            rng.insertNode(tab, true);
            rng = range.create(tab, tabsize);
            rng.select();
        };
        /**
         * insert paragraph
         *
         * @param {jQuery} $editable
         * @param {WrappedRange} rng Can be used in unit tests to "mock" the range
         *
         * blockquoteBreakingLevel
         *   0 - No break, the new paragraph remains inside the quote
         *   1 - Break the first blockquote in the ancestors list
         *   2 - Break all blockquotes, so that the new paragraph is not quoted (this is the default)
         */
        Typing.prototype.insertParagraph = function (editable, rng) {
            rng = rng || range.create(editable);
            // deleteContents on range.
            rng = rng.deleteContents();
            // Wrap range if it needs to be wrapped by paragraph
            rng = rng.wrapBodyInlineWithPara();
            // finding paragraph
            var splitRoot = dom.ancestor(rng.sc, dom.isPara);
            var nextPara;
            // on paragraph: split paragraph
            if (splitRoot) {
                // if it is an empty line with li
                if (dom.isEmpty(splitRoot) && dom.isLi(splitRoot)) {
                    // toogle UL/OL and escape
                    this.bullet.toggleList(splitRoot.parentNode.nodeName);
                    return;
                }
                else {
                    var blockquote = null;
                    if (this.options.blockquoteBreakingLevel === 1) {
                        blockquote = dom.ancestor(splitRoot, dom.isBlockquote);
                    }
                    else if (this.options.blockquoteBreakingLevel === 2) {
                        blockquote = dom.lastAncestor(splitRoot, dom.isBlockquote);
                    }
                    if (blockquote) {
                        // We're inside a blockquote and options ask us to break it
                        nextPara = $$1(dom.emptyPara)[0];
                        // If the split is right before a <br>, remove it so that there's no "empty line"
                        // after the split in the new blockquote created
                        if (dom.isRightEdgePoint(rng.getStartPoint()) && dom.isBR(rng.sc.nextSibling)) {
                            $$1(rng.sc.nextSibling).remove();
                        }
                        var split = dom.splitTree(blockquote, rng.getStartPoint(), { isDiscardEmptySplits: true });
                        if (split) {
                            split.parentNode.insertBefore(nextPara, split);
                        }
                        else {
                            dom.insertAfter(nextPara, blockquote); // There's no split if we were at the end of the blockquote
                        }
                    }
                    else {
                        nextPara = dom.splitTree(splitRoot, rng.getStartPoint());
                        // not a blockquote, just insert the paragraph
                        var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
                        emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
                        $$1.each(emptyAnchors, function (idx, anchor) {
                            dom.remove(anchor);
                        });
                        // replace empty heading, pre or custom-made styleTag with P tag
                        if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) {
                            nextPara = dom.replace(nextPara, 'p');
                        }
                    }
                }
                // no paragraph: insert empty paragraph
            }
            else {
                var next = rng.sc.childNodes[rng.so];
                nextPara = $$1(dom.emptyPara)[0];
                if (next) {
                    rng.sc.insertBefore(nextPara, next);
                }
                else {
                    rng.sc.appendChild(nextPara);
                }
            }
            range.create(nextPara, 0).normalize().select().scrollIntoView(editable);
        };
        return Typing;
    }());

    /**
     * @class Create a virtual table to create what actions to do in change.
     * @param {object} startPoint Cell selected to apply change.
     * @param {enum} where  Where change will be applied Row or Col. Use enum: TableResultAction.where
     * @param {enum} action Action to be applied. Use enum: TableResultAction.requestAction
     * @param {object} domTable Dom element of table to make changes.
     */
    var TableResultAction = function (startPoint, where, action, domTable) {
        var _startPoint = { 'colPos': 0, 'rowPos': 0 };
        var _virtualTable = [];
        var _actionCellList = [];
        /// ///////////////////////////////////////////
        // Private functions
        /// ///////////////////////////////////////////
        /**
         * Set the startPoint of action.
         */
        function setStartPoint() {
            if (!startPoint || !startPoint.tagName || (startPoint.tagName.toLowerCase() !== 'td' && startPoint.tagName.toLowerCase() !== 'th')) {
                console.error('Impossible to identify start Cell point.', startPoint);
                return;
            }
            _startPoint.colPos = startPoint.cellIndex;
            if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== 'tr') {
                console.error('Impossible to identify start Row point.', startPoint);
                return;
            }
            _startPoint.rowPos = startPoint.parentElement.rowIndex;
        }
        /**
         * Define virtual table position info object.
         *
         * @param {int} rowIndex Index position in line of virtual table.
         * @param {int} cellIndex Index position in column of virtual table.
         * @param {object} baseRow Row affected by this position.
         * @param {object} baseCell Cell affected by this position.
         * @param {bool} isSpan Inform if it is an span cell/row.
         */
        function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
            var objPosition = {
                'baseRow': baseRow,
                'baseCell': baseCell,
                'isRowSpan': isRowSpan,
                'isColSpan': isColSpan,
                'isVirtual': isVirtualCell
            };
            if (!_virtualTable[rowIndex]) {
                _virtualTable[rowIndex] = [];
            }
            _virtualTable[rowIndex][cellIndex] = objPosition;
        }
        /**
         * Create action cell object.
         *
         * @param {object} virtualTableCellObj Object of specific position on virtual table.
         * @param {enum} resultAction Action to be applied in that item.
         */
        function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
            return {
                'baseCell': virtualTableCellObj.baseCell,
                'action': resultAction,
                'virtualTable': {
                    'rowIndex': virtualRowPosition,
                    'cellIndex': virtualColPosition
                }
            };
        }
        /**
         * Recover free index of row to append Cell.
         *
         * @param {int} rowIndex Index of row to find free space.
         * @param {int} cellIndex Index of cell to find free space in table.
         */
        function recoverCellIndex(rowIndex, cellIndex) {
            if (!_virtualTable[rowIndex]) {
                return cellIndex;
            }
            if (!_virtualTable[rowIndex][cellIndex]) {
                return cellIndex;
            }
            var newCellIndex = cellIndex;
            while (_virtualTable[rowIndex][newCellIndex]) {
                newCellIndex++;
                if (!_virtualTable[rowIndex][newCellIndex]) {
                    return newCellIndex;
                }
            }
        }
        /**
         * Recover info about row and cell and add information to virtual table.
         *
         * @param {object} row Row to recover information.
         * @param {object} cell Cell to recover information.
         */
        function addCellInfoToVirtual(row, cell) {
            var cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
            var cellHasColspan = (cell.colSpan > 1);
            var cellHasRowspan = (cell.rowSpan > 1);
            var isThisSelectedCell = (row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos);
            setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);
            // Add span rows to virtual Table.
            var rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;
            if (rowspanNumber > 1) {
                for (var rp = 1; rp < rowspanNumber; rp++) {
                    var rowspanIndex = row.rowIndex + rp;
                    adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
                    setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
                }
            }
            // Add span cols to virtual table.
            var colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;
            if (colspanNumber > 1) {
                for (var cp = 1; cp < colspanNumber; cp++) {
                    var cellspanIndex = recoverCellIndex(row.rowIndex, (cellIndex + cp));
                    adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
                    setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
                }
            }
        }
        /**
         * Process validation and adjust of start point if needed
         *
         * @param {int} rowIndex
         * @param {int} cellIndex
         * @param {object} cell
         * @param {bool} isSelectedCell
         */
        function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
            if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
                _startPoint.colPos++;
            }
        }
        /**
         * Create virtual table of cells with all cells, including span cells.
         */
        function createVirtualTable() {
            var rows = domTable.rows;
            for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                var cells = rows[rowIndex].cells;
                for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                    addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
                }
            }
        }
        /**
         * Get action to be applied on the cell.
         *
         * @param {object} cell virtual table cell to apply action
         */
        function getDeleteResultActionToCell(cell) {
            switch (where) {
                case TableResultAction.where.Column:
                    if (cell.isColSpan) {
                        return TableResultAction.resultAction.SubtractSpanCount;
                    }
                    break;
                case TableResultAction.where.Row:
                    if (!cell.isVirtual && cell.isRowSpan) {
                        return TableResultAction.resultAction.AddCell;
                    }
                    else if (cell.isRowSpan) {
                        return TableResultAction.resultAction.SubtractSpanCount;
                    }
                    break;
            }
            return TableResultAction.resultAction.RemoveCell;
        }
        /**
         * Get action to be applied on the cell.
         *
         * @param {object} cell virtual table cell to apply action
         */
        function getAddResultActionToCell(cell) {
            switch (where) {
                case TableResultAction.where.Column:
                    if (cell.isColSpan) {
                        return TableResultAction.resultAction.SumSpanCount;
                    }
                    else if (cell.isRowSpan && cell.isVirtual) {
                        return TableResultAction.resultAction.Ignore;
                    }
                    break;
                case TableResultAction.where.Row:
                    if (cell.isRowSpan) {
                        return TableResultAction.resultAction.SumSpanCount;
                    }
                    else if (cell.isColSpan && cell.isVirtual) {
                        return TableResultAction.resultAction.Ignore;
                    }
                    break;
            }
            return TableResultAction.resultAction.AddCell;
        }
        function init() {
            setStartPoint();
            createVirtualTable();
        }
        /// ///////////////////////////////////////////
        // Public functions
        /// ///////////////////////////////////////////
        /**
         * Recover array os what to do in table.
         */
        this.getActionList = function () {
            var fixedRow = (where === TableResultAction.where.Row) ? _startPoint.rowPos : -1;
            var fixedCol = (where === TableResultAction.where.Column) ? _startPoint.colPos : -1;
            var actualPosition = 0;
            var canContinue = true;
            while (canContinue) {
                var rowPosition = (fixedRow >= 0) ? fixedRow : actualPosition;
                var colPosition = (fixedCol >= 0) ? fixedCol : actualPosition;
                var row = _virtualTable[rowPosition];
                if (!row) {
                    canContinue = false;
                    return _actionCellList;
                }
                var cell = row[colPosition];
                if (!cell) {
                    canContinue = false;
                    return _actionCellList;
                }
                // Define action to be applied in this cell
                var resultAction = TableResultAction.resultAction.Ignore;
                switch (action) {
                    case TableResultAction.requestAction.Add:
                        resultAction = getAddResultActionToCell(cell);
                        break;
                    case TableResultAction.requestAction.Delete:
                        resultAction = getDeleteResultActionToCell(cell);
                        break;
                }
                _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));
                actualPosition++;
            }
            return _actionCellList;
        };
        init();
    };
    /**
    *
    * Where action occours enum.
    */
    TableResultAction.where = { 'Row': 0, 'Column': 1 };
    /**
    *
    * Requested action to apply enum.
    */
    TableResultAction.requestAction = { 'Add': 0, 'Delete': 1 };
    /**
    *
    * Result action to be executed enum.
    */
    TableResultAction.resultAction = { 'Ignore': 0, 'SubtractSpanCount': 1, 'RemoveCell': 2, 'AddCell': 3, 'SumSpanCount': 4 };
    /**
     *
     * @class editing.Table
     *
     * Table
     *
     */
    var Table = /** @class */ (function () {
        function Table() {
        }
        /**
         * handle tab key
         *
         * @param {WrappedRange} rng
         * @param {Boolean} isShift
         */
        Table.prototype.tab = function (rng, isShift) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var table = dom.ancestor(cell, dom.isTable);
            var cells = dom.listDescendant(table, dom.isCell);
            var nextCell = lists[isShift ? 'prev' : 'next'](cells, cell);
            if (nextCell) {
                range.create(nextCell, 0).select();
            }
        };
        /**
         * Add a new row
         *
         * @param {WrappedRange} rng
         * @param {String} position (top/bottom)
         * @return {Node}
         */
        Table.prototype.addRow = function (rng, position) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var currentTr = $$1(cell).closest('tr');
            var trAttributes = this.recoverAttributes(currentTr);
            var html = $$1('<tr' + trAttributes + '></tr>');
            var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Add, $$1(currentTr).closest('table')[0]);
            var actions = vTable.getActionList();
            for (var idCell = 0; idCell < actions.length; idCell++) {
                var currentCell = actions[idCell];
                var tdAttributes = this.recoverAttributes(currentCell.baseCell);
                switch (currentCell.action) {
                    case TableResultAction.resultAction.AddCell:
                        html.append('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        break;
                    case TableResultAction.resultAction.SumSpanCount:
                        if (position === 'top') {
                            var baseCellTr = currentCell.baseCell.parent;
                            var isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest('tr').rowIndex) <= currentTr[0].rowIndex;
                            if (isTopFromRowSpan) {
                                var newTd = $$1('<div></div>').append($$1('<td' + tdAttributes + '>' + dom.blank + '</td>').removeAttr('rowspan')).html();
                                html.append(newTd);
                                break;
                            }
                        }
                        var rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
                        rowspanNumber++;
                        currentCell.baseCell.setAttribute('rowSpan', rowspanNumber);
                        break;
                }
            }
            if (position === 'top') {
                currentTr.before(html);
            }
            else {
                var cellHasRowspan = (cell.rowSpan > 1);
                if (cellHasRowspan) {
                    var lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
                    $$1($$1(currentTr).parent().find('tr')[lastTrIndex]).after($$1(html));
                    return;
                }
                currentTr.after(html);
            }
        };
        /**
         * Add a new col
         *
         * @param {WrappedRange} rng
         * @param {String} position (left/right)
         * @return {Node}
         */
        Table.prototype.addCol = function (rng, position) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var row = $$1(cell).closest('tr');
            var rowsGroup = $$1(row).siblings();
            rowsGroup.push(row);
            var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Add, $$1(row).closest('table')[0]);
            var actions = vTable.getActionList();
            for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                var currentCell = actions[actionIndex];
                var tdAttributes = this.recoverAttributes(currentCell.baseCell);
                switch (currentCell.action) {
                    case TableResultAction.resultAction.AddCell:
                        if (position === 'right') {
                            $$1(currentCell.baseCell).after('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        }
                        else {
                            $$1(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        }
                        break;
                    case TableResultAction.resultAction.SumSpanCount:
                        if (position === 'right') {
                            var colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
                            colspanNumber++;
                            currentCell.baseCell.setAttribute('colSpan', colspanNumber);
                        }
                        else {
                            $$1(currentCell.baseCell).before('<td' + tdAttributes + '>' + dom.blank + '</td>');
                        }
                        break;
                }
            }
        };
        /*
        * Copy attributes from element.
        *
        * @param {object} Element to recover attributes.
        * @return {string} Copied string elements.
        */
        Table.prototype.recoverAttributes = function (el) {
            var resultStr = '';
            if (!el) {
                return resultStr;
            }
            var attrList = el.attributes || [];
            for (var i = 0; i < attrList.length; i++) {
                if (attrList[i].name.toLowerCase() === 'id') {
                    continue;
                }
                if (attrList[i].specified) {
                    resultStr += ' ' + attrList[i].name + '=\'' + attrList[i].value + '\'';
                }
            }
            return resultStr;
        };
        /**
         * Delete current row
         *
         * @param {WrappedRange} rng
         * @return {Node}
         */
        Table.prototype.deleteRow = function (rng) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var row = $$1(cell).closest('tr');
            var cellPos = row.children('td, th').index($$1(cell));
            var rowPos = row[0].rowIndex;
            var vTable = new TableResultAction(cell, TableResultAction.where.Row, TableResultAction.requestAction.Delete, $$1(row).closest('table')[0]);
            var actions = vTable.getActionList();
            for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                if (!actions[actionIndex]) {
                    continue;
                }
                var baseCell = actions[actionIndex].baseCell;
                var virtualPosition = actions[actionIndex].virtualTable;
                var hasRowspan = (baseCell.rowSpan && baseCell.rowSpan > 1);
                var rowspanNumber = (hasRowspan) ? parseInt(baseCell.rowSpan, 10) : 0;
                switch (actions[actionIndex].action) {
                    case TableResultAction.resultAction.Ignore:
                        continue;
                    case TableResultAction.resultAction.AddCell:
                        var nextRow = row.next('tr')[0];
                        if (!nextRow) {
                            continue;
                        }
                        var cloneRow = row[0].cells[cellPos];
                        if (hasRowspan) {
                            if (rowspanNumber > 2) {
                                rowspanNumber--;
                                nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                                nextRow.cells[cellPos].setAttribute('rowSpan', rowspanNumber);
                                nextRow.cells[cellPos].innerHTML = '';
                            }
                            else if (rowspanNumber === 2) {
                                nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                                nextRow.cells[cellPos].removeAttribute('rowSpan');
                                nextRow.cells[cellPos].innerHTML = '';
                            }
                        }
                        continue;
                    case TableResultAction.resultAction.SubtractSpanCount:
                        if (hasRowspan) {
                            if (rowspanNumber > 2) {
                                rowspanNumber--;
                                baseCell.setAttribute('rowSpan', rowspanNumber);
                                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                                    baseCell.innerHTML = '';
                                }
                            }
                            else if (rowspanNumber === 2) {
                                baseCell.removeAttribute('rowSpan');
                                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                                    baseCell.innerHTML = '';
                                }
                            }
                        }
                        continue;
                    case TableResultAction.resultAction.RemoveCell:
                        // Do not need remove cell because row will be deleted.
                        continue;
                }
            }
            row.remove();
        };
        /**
         * Delete current col
         *
         * @param {WrappedRange} rng
         * @return {Node}
         */
        Table.prototype.deleteCol = function (rng) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var row = $$1(cell).closest('tr');
            var cellPos = row.children('td, th').index($$1(cell));
            var vTable = new TableResultAction(cell, TableResultAction.where.Column, TableResultAction.requestAction.Delete, $$1(row).closest('table')[0]);
            var actions = vTable.getActionList();
            for (var actionIndex = 0; actionIndex < actions.length; actionIndex++) {
                if (!actions[actionIndex]) {
                    continue;
                }
                switch (actions[actionIndex].action) {
                    case TableResultAction.resultAction.Ignore:
                        continue;
                    case TableResultAction.resultAction.SubtractSpanCount:
                        var baseCell = actions[actionIndex].baseCell;
                        var hasColspan = (baseCell.colSpan && baseCell.colSpan > 1);
                        if (hasColspan) {
                            var colspanNumber = (baseCell.colSpan) ? parseInt(baseCell.colSpan, 10) : 0;
                            if (colspanNumber > 2) {
                                colspanNumber--;
                                baseCell.setAttribute('colSpan', colspanNumber);
                                if (baseCell.cellIndex === cellPos) {
                                    baseCell.innerHTML = '';
                                }
                            }
                            else if (colspanNumber === 2) {
                                baseCell.removeAttribute('colSpan');
                                if (baseCell.cellIndex === cellPos) {
                                    baseCell.innerHTML = '';
                                }
                            }
                        }
                        continue;
                    case TableResultAction.resultAction.RemoveCell:
                        dom.remove(actions[actionIndex].baseCell, true);
                        continue;
                }
            }
        };
        /**
         * create empty table element
         *
         * @param {Number} rowCount
         * @param {Number} colCount
         * @return {Node}
         */
        Table.prototype.createTable = function (colCount, rowCount, options) {
            var tds = [];
            var tdHTML;
            for (var idxCol = 0; idxCol < colCount; idxCol++) {
                tds.push('<td>' + dom.blank + '</td>');
            }
            tdHTML = tds.join('');
            var trs = [];
            var trHTML;
            for (var idxRow = 0; idxRow < rowCount; idxRow++) {
                trs.push('<tr>' + tdHTML + '</tr>');
            }
            trHTML = trs.join('');
            var $table = $$1('<table>' + trHTML + '</table>');
            if (options && options.tableClassName) {
                $table.addClass(options.tableClassName);
            }
            return $table[0];
        };
        /**
         * Delete current table
         *
         * @param {WrappedRange} rng
         * @return {Node}
         */
        Table.prototype.deleteTable = function (rng) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            $$1(cell).closest('table').remove();
        };
        return Table;
    }());

    var KEY_BOGUS = 'bogus';
    /**
     * @class Editor
     */
    var Editor = /** @class */ (function () {
        function Editor(context) {
            var _this = this;
            this.context = context;
            this.$note = context.layoutInfo.note;
            this.$editor = context.layoutInfo.editor;
            this.$editable = context.layoutInfo.editable;
            this.options = context.options;
            this.lang = this.options.langInfo;
            this.editable = this.$editable[0];
            this.lastRange = null;
            this.style = new Style();
            this.table = new Table();
            this.typing = new Typing(context);
            this.bullet = new Bullet();
            this.history = new History(this.$editable);
            this.context.memo('help.undo', this.lang.help.undo);
            this.context.memo('help.redo', this.lang.help.redo);
            this.context.memo('help.tab', this.lang.help.tab);
            this.context.memo('help.untab', this.lang.help.untab);
            this.context.memo('help.insertParagraph', this.lang.help.insertParagraph);
            this.context.memo('help.insertOrderedList', this.lang.help.insertOrderedList);
            this.context.memo('help.insertUnorderedList', this.lang.help.insertUnorderedList);
            this.context.memo('help.indent', this.lang.help.indent);
            this.context.memo('help.outdent', this.lang.help.outdent);
            this.context.memo('help.formatPara', this.lang.help.formatPara);
            this.context.memo('help.insertHorizontalRule', this.lang.help.insertHorizontalRule);
            this.context.memo('help.fontName', this.lang.help.fontName);
            // native commands(with execCommand), generate function for execCommand
            var commands = [
                'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                'formatBlock', 'removeFormat', 'backColor',
            ];
            for (var idx = 0, len = commands.length; idx < len; idx++) {
                this[commands[idx]] = (function (sCmd) {
                    return function (value) {
                        _this.beforeCommand();
                        document.execCommand(sCmd, false, value);
                        _this.afterCommand(true);
                    };
                })(commands[idx]);
                this.context.memo('help.' + commands[idx], this.lang.help[commands[idx]]);
            }
            this.fontName = this.wrapCommand(function (value) {
                return _this.fontStyling('font-family', "\'" + value + "\'");
            });
            this.fontSize = this.wrapCommand(function (value) {
                return _this.fontStyling('font-size', value + 'px');
            });
            for (var idx = 1; idx <= 6; idx++) {
                this['formatH' + idx] = (function (idx) {
                    return function () {
                        _this.formatBlock('H' + idx);
                    };
                })(idx);
                this.context.memo('help.formatH' + idx, this.lang.help['formatH' + idx]);
            }
            this.insertParagraph = this.wrapCommand(function () {
                _this.typing.insertParagraph(_this.editable);
            });
            this.insertOrderedList = this.wrapCommand(function () {
                _this.bullet.insertOrderedList(_this.editable);
            });
            this.insertUnorderedList = this.wrapCommand(function () {
                _this.bullet.insertUnorderedList(_this.editable);
            });
            this.indent = this.wrapCommand(function () {
                _this.bullet.indent(_this.editable);
            });
            this.outdent = this.wrapCommand(function () {
                _this.bullet.outdent(_this.editable);
            });
            /**
             * insertNode
             * insert node
             * @param {Node} node
             */
            this.insertNode = this.wrapCommand(function (node) {
                if (_this.isLimited($$1(node).text().length)) {
                    return;
                }
                var rng = _this.getLastRange();
                rng.insertNode(node);
                range.createFromNodeAfter(node).select();
                _this.setLastRange();
            });
            /**
             * insert text
             * @param {String} text
             */
            this.insertText = this.wrapCommand(function (text) {
                if (_this.isLimited(text.length)) {
                    return;
                }
                var rng = _this.getLastRange();
                var textNode = rng.insertNode(dom.createText(text));
                range.create(textNode, dom.nodeLength(textNode)).select();
                _this.setLastRange();
            });
            /**
             * paste HTML
             * @param {String} markup
             */
            this.pasteHTML = this.wrapCommand(function (markup) {
                if (_this.isLimited(markup.length)) {
                    return;
                }
                markup = _this.context.invoke('codeview.purify', markup);
                var contents = _this.getLastRange().pasteHTML(markup);
                range.createFromNodeAfter(lists.last(contents)).select();
                _this.setLastRange();
            });
            /**
             * formatBlock
             *
             * @param {String} tagName
             */
            this.formatBlock = this.wrapCommand(function (tagName, $target) {
                var onApplyCustomStyle = _this.options.callbacks.onApplyCustomStyle;
                if (onApplyCustomStyle) {
                    onApplyCustomStyle.call(_this, $target, _this.context, _this.onFormatBlock);
                }
                else {
                    _this.onFormatBlock(tagName, $target);
                }
            });
            /**
             * insert horizontal rule
             */
            this.insertHorizontalRule = this.wrapCommand(function () {
                var hrNode = _this.getLastRange().insertNode(dom.create('HR'));
                if (hrNode.nextSibling) {
                    range.create(hrNode.nextSibling, 0).normalize().select();
                    _this.setLastRange();
                }
            });
            /**
             * lineHeight
             * @param {String} value
             */
            this.lineHeight = this.wrapCommand(function (value) {
                _this.style.stylePara(_this.getLastRange(), {
                    lineHeight: value
                });
            });
            /**
             * create link (command)
             *
             * @param {Object} linkInfo
             */
            this.createLink = this.wrapCommand(function (linkInfo) {
                var linkUrl = linkInfo.url;
                var linkText = linkInfo.text;
                var isNewWindow = linkInfo.isNewWindow;
                var rng = linkInfo.range || _this.getLastRange();
                var additionalTextLength = linkText.length - rng.toString().length;
                if (additionalTextLength > 0 && _this.isLimited(additionalTextLength)) {
                    return;
                }
                var isTextChanged = rng.toString() !== linkText;
                // handle spaced urls from input
                if (typeof linkUrl === 'string') {
                    linkUrl = linkUrl.trim();
                }
                if (_this.options.onCreateLink) {
                    linkUrl = _this.options.onCreateLink(linkUrl);
                }
                else {
                    // if url doesn't have any protocol and not even a relative or a label, use http:// as default
                    linkUrl = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/.test(linkUrl)
                        ? linkUrl : 'http://' + linkUrl;
                }
                var anchors = [];
                if (isTextChanged) {
                    rng = rng.deleteContents();
                    var anchor = rng.insertNode($$1('<A>' + linkText + '</A>')[0]);
                    anchors.push(anchor);
                }
                else {
                    anchors = _this.style.styleNodes(rng, {
                        nodeName: 'A',
                        expandClosestSibling: true,
                        onlyPartialContains: true
                    });
                }
                $$1.each(anchors, function (idx, anchor) {
                    $$1(anchor).attr('href', linkUrl);
                    if (isNewWindow) {
                        $$1(anchor).attr('target', '_blank');
                    }
                    else {
                        $$1(anchor).removeAttr('target');
                    }
                });
                var startRange = range.createFromNodeBefore(lists.head(anchors));
                var startPoint = startRange.getStartPoint();
                var endRange = range.createFromNodeAfter(lists.last(anchors));
                var endPoint = endRange.getEndPoint();
                range.create(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset).select();
                _this.setLastRange();
            });
            /**
             * setting color
             *
             * @param {Object} sObjColor  color code
             * @param {String} sObjColor.foreColor foreground color
             * @param {String} sObjColor.backColor background color
             */
            this.color = this.wrapCommand(function (colorInfo) {
                var foreColor = colorInfo.foreColor;
                var backColor = colorInfo.backColor;
                if (foreColor) {
                    document.execCommand('foreColor', false, foreColor);
                }
                if (backColor) {
                    document.execCommand('backColor', false, backColor);
                }
            });
            /**
             * Set foreground color
             *
             * @param {String} colorCode foreground color code
             */
            this.foreColor = this.wrapCommand(function (colorInfo) {
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('foreColor', false, colorInfo);
            });
            /**
             * insert Table
             *
             * @param {String} dimension of table (ex : "5x5")
             */
            this.insertTable = this.wrapCommand(function (dim) {
                var dimension = dim.split('x');
                var rng = _this.getLastRange().deleteContents();
                rng.insertNode(_this.table.createTable(dimension[0], dimension[1], _this.options));
            });
            /**
             * remove media object and Figure Elements if media object is img with Figure.
             */
            this.removeMedia = this.wrapCommand(function () {
                var $target = $$1(_this.restoreTarget()).parent();
                if ($target.parent('figure').length) {
                    $target.parent('figure').remove();
                }
                else {
                    $target = $$1(_this.restoreTarget()).detach();
                }
                _this.context.triggerEvent('media.delete', $target, _this.$editable);
            });
            /**
             * float me
             *
             * @param {String} value
             */
            this.floatMe = this.wrapCommand(function (value) {
                var $target = $$1(_this.restoreTarget());
                $target.toggleClass('note-float-left', value === 'left');
                $target.toggleClass('note-float-right', value === 'right');
                $target.css('float', (value === 'none' ? '' : value));
            });
            /**
             * resize overlay element
             * @param {String} value
             */
            this.resize = this.wrapCommand(function (value) {
                var $target = $$1(_this.restoreTarget());
                value = parseFloat(value);
                if (value === 0) {
                    $target.css('width', '');
                }
                else {
                    $target.css({
                        width: value * 100 + '%',
                        height: ''
                    });
                }
            });
        }
        Editor.prototype.initialize = function () {
            var _this = this;
            // bind custom events
            this.$editable.on('keydown', function (event) {
                if (event.keyCode === key.code.ENTER) {
                    _this.context.triggerEvent('enter', event);
                }
                _this.context.triggerEvent('keydown', event);
                if (!event.isDefaultPrevented()) {
                    if (_this.options.shortcuts) {
                        _this.handleKeyMap(event);
                    }
                    else {
                        _this.preventDefaultEditableShortCuts(event);
                    }
                }
                if (_this.isLimited(1, event)) {
                    return false;
                }
            }).on('keyup', function (event) {
                _this.setLastRange();
                _this.context.triggerEvent('keyup', event);
            }).on('focus', function (event) {
                _this.setLastRange();
                _this.context.triggerEvent('focus', event);
            }).on('blur', function (event) {
                _this.context.triggerEvent('blur', event);
            }).on('mousedown', function (event) {
                _this.context.triggerEvent('mousedown', event);
            }).on('mouseup', function (event) {
                _this.setLastRange();
                _this.context.triggerEvent('mouseup', event);
            }).on('scroll', function (event) {
                _this.context.triggerEvent('scroll', event);
            }).on('paste', function (event) {
                _this.setLastRange();
                _this.context.triggerEvent('paste', event);
            });
            this.$editable.attr('spellcheck', this.options.spellCheck);
            // init content before set event
            this.$editable.html(dom.html(this.$note) || dom.emptyPara);
            this.$editable.on(env.inputEventName, func.debounce(function () {
                _this.context.triggerEvent('change', _this.$editable.html(), _this.$editable);
            }, 10));
            this.$editor.on('focusin', function (event) {
                _this.context.triggerEvent('focusin', event);
            }).on('focusout', function (event) {
                _this.context.triggerEvent('focusout', event);
            });
            if (!this.options.airMode) {
                if (this.options.width) {
                    this.$editor.outerWidth(this.options.width);
                }
                if (this.options.height) {
                    this.$editable.outerHeight(this.options.height);
                }
                if (this.options.maxHeight) {
                    this.$editable.css('max-height', this.options.maxHeight);
                }
                if (this.options.minHeight) {
                    this.$editable.css('min-height', this.options.minHeight);
                }
            }
            this.history.recordUndo();
            this.setLastRange();
        };
        Editor.prototype.destroy = function () {
            this.$editable.off();
        };
        Editor.prototype.handleKeyMap = function (event) {
            var keyMap = this.options.keyMap[env.isMac ? 'mac' : 'pc'];
            var keys = [];
            if (event.metaKey) {
                keys.push('CMD');
            }
            if (event.ctrlKey && !event.altKey) {
                keys.push('CTRL');
            }
            if (event.shiftKey) {
                keys.push('SHIFT');
            }
            var keyName = key.nameFromCode[event.keyCode];
            if (keyName) {
                keys.push(keyName);
            }
            var eventName = keyMap[keys.join('+')];
            if (eventName) {
                if (this.context.invoke(eventName) !== false) {
                    event.preventDefault();
                }
            }
            else if (key.isEdit(event.keyCode)) {
                this.afterCommand();
            }
        };
        Editor.prototype.preventDefaultEditableShortCuts = function (event) {
            // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
            if ((event.ctrlKey || event.metaKey) &&
                lists.contains([66, 73, 85], event.keyCode)) {
                event.preventDefault();
            }
        };
        Editor.prototype.isLimited = function (pad, event) {
            pad = pad || 0;
            if (typeof event !== 'undefined') {
                if (key.isMove(event.keyCode) ||
                    (event.ctrlKey || event.metaKey) ||
                    lists.contains([key.code.BACKSPACE, key.code.DELETE], event.keyCode)) {
                    return false;
                }
            }
            if (this.options.maxTextLength > 0) {
                if ((this.$editable.text().length + pad) >= this.options.maxTextLength) {
                    return true;
                }
            }
            return false;
        };
        /**
         * create range
         * @return {WrappedRange}
         */
        Editor.prototype.createRange = function () {
            this.focus();
            this.setLastRange();
            return this.getLastRange();
        };
        Editor.prototype.setLastRange = function () {
            this.lastRange = range.create(this.editable);
        };
        Editor.prototype.getLastRange = function () {
            if (!this.lastRange) {
                this.setLastRange();
            }
            return this.lastRange;
        };
        /**
         * saveRange
         *
         * save current range
         *
         * @param {Boolean} [thenCollapse=false]
         */
        Editor.prototype.saveRange = function (thenCollapse) {
            if (thenCollapse) {
                this.getLastRange().collapse().select();
            }
        };
        /**
         * restoreRange
         *
         * restore lately range
         */
        Editor.prototype.restoreRange = function () {
            if (this.lastRange) {
                this.lastRange.select();
                this.focus();
            }
        };
        Editor.prototype.saveTarget = function (node) {
            this.$editable.data('target', node);
        };
        Editor.prototype.clearTarget = function () {
            this.$editable.removeData('target');
        };
        Editor.prototype.restoreTarget = function () {
            return this.$editable.data('target');
        };
        /**
         * currentStyle
         *
         * current style
         * @return {Object|Boolean} unfocus
         */
        Editor.prototype.currentStyle = function () {
            var rng = range.create();
            if (rng) {
                rng = rng.normalize();
            }
            return rng ? this.style.current(rng) : this.style.fromNode(this.$editable);
        };
        /**
         * style from node
         *
         * @param {jQuery} $node
         * @return {Object}
         */
        Editor.prototype.styleFromNode = function ($node) {
            return this.style.fromNode($node);
        };
        /**
         * undo
         */
        Editor.prototype.undo = function () {
            this.context.triggerEvent('before.command', this.$editable.html());
            this.history.undo();
            this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        };
        /*
        * commit
        */
        Editor.prototype.commit = function () {
            this.context.triggerEvent('before.command', this.$editable.html());
            this.history.commit();
            this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        };
        /**
         * redo
         */
        Editor.prototype.redo = function () {
            this.context.triggerEvent('before.command', this.$editable.html());
            this.history.redo();
            this.context.triggerEvent('change', this.$editable.html(), this.$editable);
        };
        /**
         * before command
         */
        Editor.prototype.beforeCommand = function () {
            this.context.triggerEvent('before.command', this.$editable.html());
            // keep focus on editable before command execution
            this.focus();
        };
        /**
         * after command
         * @param {Boolean} isPreventTrigger
         */
        Editor.prototype.afterCommand = function (isPreventTrigger) {
            this.normalizeContent();
            this.history.recordUndo();
            if (!isPreventTrigger) {
                this.context.triggerEvent('change', this.$editable.html(), this.$editable);
            }
        };
        /**
         * handle tab key
         */
        Editor.prototype.tab = function () {
            var rng = this.getLastRange();
            if (rng.isCollapsed() && rng.isOnCell()) {
                this.table.tab(rng);
            }
            else {
                if (this.options.tabSize === 0) {
                    return false;
                }
                if (!this.isLimited(this.options.tabSize)) {
                    this.beforeCommand();
                    this.typing.insertTab(rng, this.options.tabSize);
                    this.afterCommand();
                }
            }
        };
        /**
         * handle shift+tab key
         */
        Editor.prototype.untab = function () {
            var rng = this.getLastRange();
            if (rng.isCollapsed() && rng.isOnCell()) {
                this.table.tab(rng, true);
            }
            else {
                if (this.options.tabSize === 0) {
                    return false;
                }
            }
        };
        /**
         * run given function between beforeCommand and afterCommand
         */
        Editor.prototype.wrapCommand = function (fn) {
            return function () {
                this.beforeCommand();
                fn.apply(this, arguments);
                this.afterCommand();
            };
        };
        /**
         * insert image
         *
         * @param {String} src
         * @param {String|Function} param
         * @return {Promise}
         */
        Editor.prototype.insertImage = function (src, param) {
            var _this = this;
            return createImage(src, param).then(function ($image) {
                _this.beforeCommand();
                if (typeof param === 'function') {
                    param($image);
                }
                else {
                    if (typeof param === 'string') {
                        $image.attr('data-filename', param);
                    }
                    $image.css('width', Math.min(_this.$editable.width(), $image.width()));
                }
                $image.show();
                range.create(_this.editable).insertNode($image[0]);
                range.createFromNodeAfter($image[0]).select();
                _this.setLastRange();
                _this.afterCommand();
            }).fail(function (e) {
                _this.context.triggerEvent('image.upload.error', e);
            });
        };
        /**
         * insertImages
         * @param {File[]} files
         */
        Editor.prototype.insertImagesAsDataURL = function (files) {
            var _this = this;
            $$1.each(files, function (idx, file) {
                var filename = file.name;
                if (_this.options.maximumImageFileSize && _this.options.maximumImageFileSize < file.size) {
                    _this.context.triggerEvent('image.upload.error', _this.lang.image.maximumFileSizeError);
                }
                else {
                    readFileAsDataURL(file).then(function (dataURL) {
                        return _this.insertImage(dataURL, filename);
                  