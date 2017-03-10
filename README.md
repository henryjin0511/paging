# paging

基于原生javascript的分页插件，支持高度自定义的css样式，包含分页，上下页，首尾页，总页数，跳页等常用分页功能。

### [实例展示/example page](https://jinming6568.github.io/paging/) and [参考文档/api page](https://jinming6568.github.io/paging/doc.html)

## Get start
```html
<script src="js/paging.js"></script>
<link rel="stylesheet" href="css/paging.css" />
<div id="pagination"></div>
<script>
var paging1 = paging({
    cont:'pagination',
    pages:12,
    groups:5,
    curr:6,
    total:true,
    skip:true
});
</script>
```

![demo.png](./src/demo.png)

## 参数/Options

* **`cont`** : `String|Object` 默认为'pagination'，用来储存分页DOM元素，支持传入ID名称或者原生DOM对象
* **`pages`** : `Number` 默认为1，分页总数
* **`curr`** : `Number` 默认为1，当前页码
* **`groups`** : `Number` 默认为5，显示连续分页数量
* **`first`** : `String|Number|Boolean` 默认为1，首页显示内容，默认为1，传入false时不显示
* **`last`** : `String|Number|Boolean` 默认为pages的值，尾页显示内容，默认等于总页数，传入false时不显示
* **`prev`** : `String` 默认为'上一页'，上一页按钮显示内容
* **`last`** : `String` 默认为'下一页'，下一页按钮显示内容
* **`total`** : `Boolean` 默认为false，是否显示总页数，默认不显示
* **`skip`** : `Boolean` 默认为false，是否开启跳页，默认不开启
* **`reset`** : `Boolean` 默认为false，是第一次加载是否触发跳页事件，默认为false

## 事件/Events

* **`pageChange`** : 分页跳转回调
```javascript
paging({
    pageChange:function() {
        //console.log(this);此时this为当前pageing对象，通过this.opts可以拿到当前分页对象参数
    }
});
```

* **`overPageSkip`** : 跳页或输入大于分页数时跳页触发事件
```javascript
paging({
    overPageSkip:function() {
        //console.log(this);此时this为当前pageing对象，通过this.opts可以拿到当前分页对象参数
    }
});
```

## 方法/Methods

* **`.prev();`** : 上一页
```javascript
var paging1 = paging(options);
paging1.prev();//上一页
```

* **`.next();`** : 下一页
```javascript
var paging1 = paging(options);
paging1.next();//下一页
```

* **`.skip(num);`** : 跳页 num为想要跳页的页码
```javascript
var paging1 = paging(options);
paging1.skip(5);//跳转至第五页
```