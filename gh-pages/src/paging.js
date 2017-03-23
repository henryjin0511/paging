!function (window,undefined) {
	"use strict";
	function paging(options) {
		return new Paging(options);
	}
	var index = 0;
	function Paging(options) {
		var defaultOpts = {
			cont: 'pagination',
			pages: 1,
			curr: 1,
			groups: 5,
			first: 1,
			last: true,
			prev: '&#19978;&#19968;&#39029;',
			next: '&#19979;&#19968;&#39029;',
			total: false,
			skip: false,
			reset: false,
			pageChange: function (opts) {},
			overPageSkip:function (tpage) {}
		};
		this.opts = Paging.deepCopy(defaultOpts, options);
		this.opts.item = index++; //单页面多次调用分ID
		this.init(this.opts.reset);
	}
	Paging.deepCopy = function (target, origin) {
		target = target || {};
		for (var i in origin) {
			if (origin.hasOwnProperty(i)) {
				if (typeof (origin[i]) === 'object') {
					target[i] = origin[i].constructor === Array ? [] : {};
					Paging.deepCopy(target[i], origin[i]);
				} else {
					target[i] = origin[i];
				}
			}
		}
		return target;
	};
	//事件绑定
	Paging.prototype.on = function (ele, tevent, handlr) {
		document.addEventListener?ele.addEventListener(tevent,handlr,false):ele.attachEvent('on'+tevent,function () {
			handlr.call(ele,window.event);
		});
	};
	//初始化
	Paging.prototype.init = function (reset) {
	    var _this = this,opts = _this.opts;
	    console.log(opts.item);
	    opts.pages = ((opts.pages | 0)<=0)?1:(opts.pages | 0);
	    opts.curr = ((opts.curr | 0)<=0)?1:(opts.curr | 0);
	    opts.groups = ((opts.groups | 0)<0)?5:(opts.groups | 0);
        _this.render();
        _this.bindEvents(document.getElementById('paging' + opts.item));
		if(typeof reset === 'undefined' || reset === true){
			opts.pageChange && opts.pageChange.call(_this);
		}
	};
	//视图渲染
	Paging.prototype.render = function () {
		var _this = this,
			htmlStr = '',
			opts = _this.opts,
			view = [],
			sign = {},
			pages = opts.pages | 0,
			curr = opts.curr | 0 ,
			groups = opts.groups | 0,
			first = opts.first,
			last = opts.last,
			prev = opts.prev,
			next = opts.next,
			total = opts.total,
			skip = opts.skip;
		//是否显示上一页
		if (prev && curr > 1) {
			view.push('<a href="javascript:;" class="paging-prev" data-page="' + (curr - 1) + '">' + prev + '</a>');
		} else if (prev && curr <= 1) {
			view.push('<a href="javascript:;" class="paging-prev paging-disabled">' + prev + '</a>');
		}
		//计算当前显示第一页和最后一页
		sign.start = Math.max(Math.min(curr - Math.floor(groups / 2), pages - groups + 1), 1);
		sign.end = Math.min(sign.start + groups - 1, pages);
		//是否显示首页
		if (first && sign.start !== 1 && groups) {
			view.push('<a href="javascript:;" class="paging-first ' + (curr <= 1 ? "paging-disabled" : '') + '" data-page="1"  title="&#x9996;&#x9875;">' + first + '</a><span class="paging-dot">&#x2026;</span>');
		}
		for (; sign.start <= sign.end; sign.start++) {
			if (sign.start === curr) {
				view.push('<span class="paging-item paging-curr">' + curr + '</span>');
			} else {
				view.push('<a class="paging-item" href="javascript:;" data-page="' + sign.start + '">' + sign.start + '</a>');
			}
		}
		//是否显示尾页
		if (last && sign.end !== pages && groups) {
			view.push('<span class="paging-dot">&#x2026;</span><a href="javascript:;" class="paging-last" title="&#x5C3E;&#x9875;"  data-page="' + pages + '">' + (last === true ? pages : last) + '</a>');
		}
		//是否显示下一页
		if (next && curr < pages) {
			view.push('<a href="javascript:;" class="paging-next" data-page="' + (curr + 1) + '">' + next + '</a>');
		} else if (prev && curr >= pages) {
			view.push('<a href="javascript:;" class="paging-next paging-disabled">' + next + '</a>');
		}

		//是否显示共多少页
		if (total) {
			view.push('<span href="javascript:;" class="paging-total">&#20849; ' + pages + ' &#39029;</span>');
		}
		//是否开启跳页
		if (skip) {
			view.push('<div class="paging-skip"><span>&#x5230;&#x7B2C;</span><input type="number" min="1" value="' + curr + '" onkeyup="this.value=this.value.replace(/\\D/, \'\');"><span>&#x9875;</span><button type="button" class="paging-btn">&#x786e;&#x5b9a;</button></div>');
		}
        htmlStr =  '<div class="paging-box" id="paging' + _this.opts.item + '">' + view.join('') + '</div>';
        if(typeof opts.cont === 'object'){
            opts.cont['innerHTML'] = htmlStr;
        }else{
            document.getElementById(opts.cont).innerHTML = htmlStr;
        }
	};
	//事件绑定
	Paging.prototype.bindEvents = function (oPaging) {console.log(oPaging);
		if (!oPaging) return;
		var _this = this,
			opts = _this.opts,
			children = oPaging.children,
			oBtn = oPaging.getElementsByTagName('button')[0],
			oInput = oPaging.getElementsByTagName('input')[0];
		//分页按钮事件
		for (var i = 0, len = children.length; i < len; i++) {
			if (children[i].nodeName.toLowerCase() === 'a') {
				_this.on(children[i], 'click', function () {
					var tpage = this.getAttribute('data-page') | 0;
					if(tpage <= 0){
						return false;
					}
					opts.curr = tpage;
					_this.init();
				});
			}
		}
		//跳页事件
		if (opts.skip && oBtn) {
			_this.on(oBtn, 'click', function () {
				var ableSkip = true,tpage = oInput.value.replace(/\s|\D/g, '') | 0;
				if(tpage > opts.pages){
					oInput.focus();
					ableSkip = opts.overPageSkip.call(_this,tpage);
				}
				if(!ableSkip){
					return false;
				}
				opts.curr = tpage;
				_this.init();
			});
		}
	};
	Paging.prototype.skip = function (tpage) {
		var _this = this,opts = _this.opts,skip = true;
		if(isNaN(tpage) || tpage > opts.pages){
			skip = opts.overPageSkip.call(_this,tpage);
		}
		if(!skip){
			return false;
		}
        opts.curr = tpage;
        _this.init();
	};
	Paging.prototype.prev = function () {
		var _this = this,opts = _this.opts;
		if(opts.curr <= 1){
			opts.curr = 1;
			return false;
		}
		opts.curr--;
		_this.init();
	};
	Paging.prototype.next = function () {
		var _this = this,opts = _this.opts;
		if(opts.curr >= opts.pages){
			opts.curr = opts.pages;
			return false;
		}
		opts.curr++;
		_this.init();
	};
	if ((typeof module === 'undefined' ? 'undefined' : typeof(module)) === "object" && module && typeof(module.exports) === "object") {
		module.exports = paging;
	} else {
		window.paging = paging;
		if (typeof define === "function" && define.amd) {
			define(function () {
				return paging;
			});
		}
	}
}(window);
