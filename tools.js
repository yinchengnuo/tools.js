////////////////////////////////////////////////////////////////////////////////////////////
//在Object上封装的一些对象方法////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// 圣杯模式实现继承的原型链写法
Object.prototype.inherit = function(Origin, Target) {
  if (Origin) {
    if (typeof this === "function") {
      var Target = Target || this;

      function F() {}
      F.prototype = Origin.prototype;
      Target.prototype = new F();
      Target.prototype.constructor = Target;
      Target.prototype.inherited = Origin.prototype;
    } else {
      console.log("请输入要继承自源构造函数的构造函数");
    }
  } else {
    console.log("请传入要继承自的源构造函数");
  }
};
// 深度克隆的原型链写法
Object.prototype.deepClone = function(Origin, Target) {
  var Target = Target || this;
  for (var prop in Origin) {
    if (Origin.hasOwnProperty(prop)) {
      if (Origin[prop] !== null && typeof Origin[prop] === "object") {
        Target[prop] =
          Object.prototype.toString.call(Origin[prop]) === "[object Array]"
            ? []
            : {};
        deepClone(Origin[prop], Target[prop]);
      } else {
        Target[prop] = Origin[prop];
      }
    }
  }
  return Target;
};
//判断对象是否是类数组
Object.prototype.isArrayLike = function() {
  if (
    this &&
    typeof this === "object" &&
    isFinite(this.length) &&
    this.length >= 0 &&
    this.length === Math.floor(this.length) &&
    this.length < 4294967296
  ) {
    return true;
  } else {
    return false;
  }
};
// 圣杯模式实现继承的立即执行函数写法
var inherit = (function() {
  var F = function() {};
  return function(Origin, Target) {
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    Target.prototype.constructor = Target;
    Target.prototype.uber = Origin.prototype.constructor;
  };
})();

////////////////////////////////////////////////////////////////////////////////////////
//在Event上封装的一些操作事件对象的方法////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//封装函数实现取消事件冒泡的兼容性方法
Event.prototype.stopBubble = function() {
  if (this.stopPropagation) {
    this.stopPropagation();
  } else {
    this.cancelBubble = true;
  }
};
//封装函数实现阻止默认事件的兼容性方法
Event.prototype.stopDefault = function() {
  if (this.preventDefault) {
    this.preventDefault();
  } else if (e.returnValue) {
    this.returnValue = false;
  }
};
//封装函数实现获取事件源对象的兼容性方法
Event.prototype.getEventTarget = function() {
  return this.target || this.srcElement;
};
Event.prototype.stopBubble = function() {
  if (this.stopPropagation) {
    this.stopPropagation();
  } else {
    this.cancelBubble = true;
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//在Node上封装的一些操作节点和事件的方法///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//封装Node上的insertAfter方法
Node.prototype.insertAfter = function(targetNode, afterNode) {
  var beforeNode = afterNode.nextSibling;
  if (beforeNode) {
    this.insertBefore(targetNode, beforeNode);
  } else {
    this.appendChild(targetNode);
  }
};
//封装Node上的reverse方法
Node.prototype.reverse = function() {
  var child = this.childNodes,
    len = child.length - 1;
  for (var i = len; i >= 0; i--) {
    this.appendChild(child[i]);
  }
  return this;
};
//封装函数实现绑定事件的兼容性方法
Node.prototype.addEvent = function(type, haddle, elem) {
  that = elem || this;
  if (that.addEventListener) {
    that.addEventListener(type, haddle, false);
  } else if (that.attachEvent) {
    that.attachEvent("on" + type, function() {
      haddle.call(that);
    });
  } else {
    that["on" + type] = haddle;
  }
};
//封装函数实现解除事件的兼容性方法
Node.prototype.removeEvent = function(type, handler, elem) {
  that = elem || this;
  if (that.removeEventListener) {
    that.removeEventListener(type, handler, false);
  } else if (that.detachEvent) {
    that.detachEvent("on" + type.handler);
  } else {
    that["on" + type] = false;
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//在Element上封装的一些查看元素对象的方法//////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//封装children方法
Element.prototype.retElementChildren = function() {
  var temp = {
      length: 0,
      push: Array.prototype.push,
      splice: Array.prototype.splice
    },
    child = this.childNodes,
    len = child.length;
  for (var i = 0; i < len; i++) {
    if (child[i].nodeType === 1) {
      temp.push(child[i]);
    }
  }
  return temp;
};
//遍历元素节点树（返回数组形式）
Element.prototype.retElementTree = function() {
  var temp = {
      len: 0,
      length: 0,
      push: Array.prototype.push,
      splice: Array.prototype.splice
    },
    child = this.childNodes,
    len = child.length;
  for (var i = 0; i < len; i++) {
    if (child[i].nodeType === 1) {
      if (child[i].hasElementChild()) {
        temp[
          child[i].nodeName.toLowerCase() + " ." + child[i].className
        ] = child[i].retElementTree();
        temp.len++;
      } else {
        temp.push(child[i]);
        temp.len++;
      }
    }
  }
  return temp;
};
//封装hasElementChild方法
Element.prototype.hasElementChild = function() {
  var child = this.childNodes,
    len = child.length;
  for (var i = 0; i < len; i++) {
    if (child[i].nodeType == 1) {
      return true;
    }
  }
  return false;
};
//返回指定元素的指定层级父级元素
Element.prototype.retParentElement = function(n) {
  var elem = this;
  while (n && elem) {
    elem = elem.parentElement;
    n--;
  }
  return elem;
};
// 返回指定元素的指定兄弟元素节点
Element.prototype.retElementSibling = function(n) {
  var elem = this;
  while (elem && n) {
    if (n > 0) {
      if (elem.nextElementSibling) {
        elem = elem.nextElementSibling;
      } else {
        for (
          elem = elem.nextSibling;
          elem && elem.nodeType != 1;
          elem = elem.nextSibling
        );
      }
      n--;
    } else if (n < 0) {
      if (elem.previousElementSibling) {
        elem = elem.previousElementSibling;
      } else {
        for (
          elem = elem.previousSibling;
          elem && elem.nodeType != 1;
          elem = elem.previousSibling
        );
      }
      n++;
    }
  }
  return elem;
};
// 封装函数实现返回一个元素相对于文档的坐标
Element.prototype.getAbsolutePosition = function() {
  if (this.offsetParent == document.body) {
    return {
      x: this.offsetLeft,
      y: this.offsetTop
    };
  } else {
    return {
      x: this.offsetLeft + getAbsolutePosition(this.offsetParent).x,
      y: this.offsetTop + getAbsolutePosition(this.offsetParent).y
    };
  }
};
//封装函数实现返回元素指定样式值的兼容性方法
Element.prototype.getStyle = function(prop) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(this, null)[prop];
  } else {
    return this.currentStle[prop];
  }
};
//封装函数实现在Document上的getElementsByClassName方法
Element.prototype.getElementsByClassName =
  Element.prototype.getElementsByClassName ||
  function(_className) {
    var allDomArr = this.getElementsByTagName("*");
    var lastArr = [];

    function trimSpace(strClass) {
      return strClass.replace(/\s+/g, " ").trim();
    }
    for (var i = 0, len = allDomArr.length; i < len; i++) {
      var lastStrClass = trimSpace(allDomArr[i].className);
      var classArr = lastStrClass.split(" ");
      for (var j = 0; j < classArr.length; j++) {
        if (classArr[j] == _className) {
          lastArr.push(allDomArr[i]);
          break;
        }
      }
    }
    return lastArr;
  };
//封装函数实现在Document上的getElementsByClassName方法
Document.prototype.getElementsByClassName =
  Document.prototype.getElementsByClassName ||
  function(_className) {
    var allDomArr = document.getElementsByTagName("*");
    var lastArr = [];

    function trimSpace(strClass) {
      return strClass.replace(/\s+/g, " ").trim();
    }
    for (var i = 0, len = allDomArr.length; i < len; i++) {
      var lastStrClass = trimSpace(allDomArr[i].className);
      var classArr = lastStrClass.split(" ");
      for (var j = 0; j < classArr.length; j++) {
        if (classArr[j] == _className) {
          lastArr.push(allDomArr[i]);
          break;
        }
      }
    }
    return lastArr;
  };

///////////////////////////////////////////////////////////////////////////////////////
//在Element上封装的一些运动方法//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//封装函数实现在文档内鼠标拖拽元素运动
Element.prototype.moveByMouse = function() {
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.margin = "0";
  var that = this;
  var bodyHeight =
    document.body.offsetHeight <= document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : document.body.offsetHeight;
  this.onmousedown = function(e) {
    var event = e || window.event;
    var diffX = e.pageX - that.offsetLeft;
    var diffY = e.pageY - that.offsetTop;
    document.onmousemove = function(e) {
      var event = e || window.event;
      that.style.left = e.pageX - diffX + "px";
      if (that.offsetWidth + that.offsetLeft >= document.body.offsetWidth) {
        that.style.left = document.body.offsetWidth - that.offsetWidth + "px";
      }
      if (that.offsetLeft <= 0) {
        that.style.left = "0px";
      }
      that.style.top = e.pageY - diffY + "px";
      if (that.offsetHeight + that.offsetTop >= bodyHeight) {
        console.log(123);
        that.style.top = bodyHeight - that.offsetHeight + "px";
      }
      if (that.offsetTop <= 0) {
        that.style.top = "0px";
      }
    };
  };
  document.onmouseup = function() {
    document.onmousemove = false;
  };
};
//指定元素相对于自身位置任意方向的匀速运动
//speedX, 横向运动速度，若纵向运动速度未设置则为全局运动速度
//targetX, 横向目标, targetY, 纵向目标, speedY， 纵向速度
//函数设置了静态属性 s 改变元素的运动速度, 可在调用函数时前设置
//用于当期望运动速度不是100px每秒时设置， 建议需要更小速度时设置， 否则建议不大于300
Element.prototype.constantMove = function(speedX, targetX, targetY, speedY) {
  clearInterval(this.timer);
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.margin = "0";
  var that = this;
  var s = Element.prototype.constantMove.s || 100;
  var S = parseInt(1000 / s);
  var keyX = false;
  var keyY = false;
  var moveTthis = function(speedX, targetX, targetY, speedY) {
    targetX += that.offsetLeft;
    targetY += that.offsetTop;
    that.timer = setInterval(function() {
      if (Math.abs(targetX - that.offsetLeft) < Math.abs(speedX)) {
        keyX = true;
        that.style.left = targetX + "px";
      } else {
        that.style.left = that.offsetLeft + speedX + "px";
      }
      if (Math.abs(targetY - that.offsetTop) < Math.abs(speedY)) {
        keyY = true;
        that.style.top = targetY + "px";
      } else {
        that.style.top = that.offsetTop + speedY + "px";
      }
      if (keyX && keyY) {
        clearInterval(that.timer);
      }
    }, S);
  };
  if (speedX && targetX && targetY && speedY) {
    if (targetX < 0) {
      speedX = -speedX;
    }
    if (targetY < 0) {
      speedY = -speedY;
    }
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX && targetY) {
    speedY = speedX;
    if (targetX < 0) {
      speedX = -speedX;
    }
    if (targetY < 0) {
      speedY = -speedY;
    }
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX) {
    keyY = true;
    if (targetX < 0) {
      speedX = -speedX;
    }
    moveTo(speedX, targetX);
  } else if (speedX) {
    moveTo(speedX);
  } else {
    alert("请传参");
  }
};
//指定元素相对于自身位置任意方向的减速运动
//speedX, 横向运动速度，取值在1和targetX之间， 若纵向运动速度未设置则为全局运动速度
//当speedX为1时速度最大， 表现为立即到达， 为targetX时元素为匀速运动
//targetX, 横向目标, targetY, 纵向目标, speedY， 纵向速度
//函数设置了静态属性 s 用于设置当speedX == target X或speedY == target Y时的匀速运动速度,
//可在调用函数时前设置，用于当期望运动速度不是100px每秒时设置
//建议需要更小速度时设置， 否则建议不大于300
Element.prototype.slowdownMove = function(speedX, targetX, targetY, speedY) {
  clearInterval(this.timer);
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.margin = "0";
  var that = this;
  var s = Element.prototype.slowdownMove.s || 100;
  var S = parseInt(1000 / s);
  var keyX = false;
  var keyY = false;
  var moveTo = function(speedX, targetX, targetY, speedY) {
    targetX += that.offsetLeft;
    targetY += that.offsetTop;
    that.timer = setInterval(function() {
      var tempX = (targetX - that.offsetLeft) / speedX;
      tempX = tempX > 0 ? Math.ceil(tempX) : Math.floor(tempX);
      if (that.offsetLeft == targetX) {
        keyX = true;
        that.style.left = targetX + "px";
      } else {
        that.style.left = that.offsetLeft + tempX + "px";
      }
      var tempY = (targetY - that.offsetTop) / speedY;
      tempY = tempY > 0 ? Math.ceil(tempY) : Math.floor(tempY);
      if (that.offsetTop == targetY) {
        keyY = true;
        that.style.top = targetY + "px";
      } else {
        that.style.top = that.offsetTop + tempY + "px";
      }
      if (keyX && keyY) {
        clearInterval(that.timer);
      }
    }, S);
  };
  if (speedX && targetX && targetY && speedY) {
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX && targetY) {
    speedY = speedX;
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX) {
    keyY = true;
    moveTo(speedX, targetX);
  } else if (speedX) {
    moveTo(speedX);
  } else {
    alert("请传参");
  }
};
//指定元素相对于自身位置任意方向的到达目标点后的弹性运动
//speedX, 横向运动速度，取值在1和targetX之间， 若纵向运动速度未设置则为全局运动速度
//当speedX为1时速度最大，targetX, 横向目标, targetY, 纵向目标, speedY， 纵向速度
//函数设置了静态属性 s 用于设置当speedX == target X或speedY == target Y时的匀速运动速度,
//函数设置了静态属性 u 改变元素停止时的摆动幅度, 可在调用函数时前设置，建议大于0.5, 小于0.9
Element.prototype.flexMove = function(speedX, targetX, targetY, speedY) {
  clearInterval(this.timer);
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.margin = "0";
  var that = this;
  var s = Element.prototype.flexMove.s || 100;
  var S = parseInt(1000 / s);
  var keyX = false;
  var keyY = false;
  var u = Element.prototype.flexMove.u || 0.8;
  var moveTo = function(speedX, targetX, targetY, speedY) {
    targetX += that.offsetLeft;
    targetY += that.offsetTop;
    var aX;
    var aY;
    var tempX = 0;
    var tempY = 0;
    that.timer = setInterval(function() {
      aY = (targetY - that.offsetTop) / speedY;
      tempY += aY;
      tempY *= u;
      if (Math.abs(tempY) < 2 && Math.abs(targetY - that.offsetTop) < 2) {
        keyY = true;
        that.style.top = targetY + "px";
      } else {
        that.style.top = that.offsetTop + tempY + "px";
      }
      aX = (targetX - that.offsetLeft) / speedX;
      tempX += aX;
      tempX *= u;
      if (Math.abs(tempX) < 2 && Math.abs(targetX - that.offsetLeft) < 2) {
        keyX = true;
        that.style.left = targetX + "px";
      } else {
        that.style.left = that.offsetLeft + tempX + "px";
      }
      if (keyX && keyY) {
        clearInterval(that.timer);
      }
    }, S);
  };
  if (speedX && targetX && targetY && speedY) {
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX && targetY) {
    speedY = speedX;
    moveTo(speedX, targetX, targetY, speedY);
  } else if (speedX && targetX) {
    keyY = true;
    moveTo(speedX, targetX);
  } else if (speedX) {
    moveTo(speedX);
  } else {
    alert("请传参");
  }
};
//指定元素的给定相对于自身属性变化
//json， 给定要变化属性的对象集合，speed， 属性变化速度
//callback， 需要执行的回调函数， time， 规定回调函数何时执行
Element.prototype.changeStyle = function(json, speed, callback, time) {
  clearInterval(this.timer);
  var temp, iValue;
  var that = this;
  var getStyle = function(elem, prop) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(elem, null)[prop];
    } else {
      return elem.currentStle[prop];
    }
  };
  setTimeout(function() {
    typeof callback == "function" ? callback() : null;
  }, time);
  this.timer = setInterval(function() {
    var key = true;
    for (var attr in json) {
      if (json.hasOwnProperty(attr)) {
        if (typeof json[attr] == "string") {
          that.style[attr] = json[attr];
        } else if (attr == "opacity") {
          iValue = parseFloat(getStyle(that, "opacity")) * 100;
        } else {
          iValue = parseInt(getStyle(that, attr));
        }
        if (attr == "opacity") {
          temp = (json[attr] * 100 - iValue) / speed;
          temp = temp > 0 ? Math.ceil(temp) : Math.floor(temp);
          that.style[attr] = (iValue + temp) / 100;
        } else {
          temp = (json[attr] - iValue) / speed;
          temp = temp > 0 ? Math.ceil(temp) : Math.floor(temp);
          that.style[attr] = iValue + temp + "px";
        }
        if (
          typeof json[attr] == "string"
            ? getStyle(that, attr) !== json[attr]
            : parseFloat(getStyle(that, attr)) !== json[attr]
        ) {
          key = false;
        }
      }
    }
    if (key) {
      clearInterval(that.timer);
    }
  }, 30);
};
//指定元素在文档内的可拖动带重力碰撞运动
//bool, 规定初始化元素时的运动状态， true为运动，false为静止
//speedX 当元素初始状态为运动时，x方向的运动速度
//speedY 当元素初始状态为运动时，y方向的运动速度
//函数设置了静态属性 e 改变元素的弹性系数, 可在调用函数时前设置，建议大于0.6， 小于0.9
//函数设置了静态属性 u 改变元素的摩擦系数, 可在调用函数时前设置，建议大于0.5
//函数设置了静态属性 g 改变元素的重力加速度, 可在调用函数时前设置，建议不改变
//函数设置了静态属性 m 改变元素的运动的最大速度, 可在调用函数时前设置，建议小于10
Element.prototype.throwMove = function(bool, speedX, speedY) {
  clearInterval(this.timer);
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.userSelect = "none";
  this.style.margin = "0";
  var that = this;
  var e = Element.prototype.throwMove.e || 0.8;
  var u = Element.prototype.throwMove.u || 0.7;
  var m = Element.prototype.throwMove.m || 999;
  var g =
    Element.prototype.throwMove.g === 0
      ? (Element.prototype.throwMove.g = 0)
      : null || 9.8;
  var bodyHeight =
    document.body.offsetHeight <= document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : document.body.offsetHeight;
  var hitMove = function(elem, speedX, speedY, bool) {
    clearInterval(elem.timer);
    elem.timer = setInterval(function() {
      speedY += parseInt(g);
      var newTop = elem.offsetTop + speedY;
      var newLeft = elem.offsetLeft + speedX;

      if (newTop >= bodyHeight - elem.offsetHeight) {
        speedY *= -1;
        speedY *= e;
        speedX *= u;
        newTop = bodyHeight - elem.offsetHeight;
      }
      if (newTop <= 0) {
        speedY *= -1;
        speedY *= e;
        speedX *= u;
        newTop = 0;
      }
      if (newLeft >= document.body.offsetWidth - elem.offsetWidth) {
        speedX *= -1;
        speedX *= u;
        speedY *= e;
        newLeft = document.body.offsetWidth - elem.offsetWidth;
      }
      if (newLeft <= 0) {
        speedX *= -1;
        speedX *= u;
        speedY *= e;
        newLeft = 0;
      }
      if (g == 0) {
        if (Math.abs(speedX) < 1 && Math.abs(speedY) < 1) {
          clearInterval(elem.timer);
        }
      } else {
        if (
          Math.abs(speedX) < 3 &&
          Math.abs(speedY) < 3 &&
          newTop == bodyHeight - elem.offsetHeight
        ) {
          clearInterval(elem.timer);
        }
      }
      elem.style.left = newLeft + "px";
      elem.style.top = newTop + "px";
    }, 30);
  };
  var event = function(elem, callback) {
    elem.onmousedown = function(e) {
      clearInterval(this.timer);
      var event = e || window.event;
      var disX = event.pageX - this.offsetLeft;
      var disY = event.pageY - this.offsetTop;
      var iSpeedX = 0;
      var iSpeedY = 0;
      var lastLeft = this.offsetLeft;
      var lastTop = this.ofsetTop;
      var that = this;
      document.onmousemove = function(e) {
        var event = e || window.event;
        var newLeft = event.pageX - disX;
        var newTop = event.pageY - disY;
        iSpeedX = newLeft - lastLeft;
        iSpeedY = newTop - lastTop;
        lastLeft = newLeft;
        lastTop = newTop;
        that.style.left = newLeft + "px";
        that.style.top = newTop + "px";
      };
      document.onmouseup = function() {
        this.onmousedown = null;
        this.onmousemove = null;
        this.onmouseup = null;
        if (Math.abs(iSpeedX) > m) {
          if (iSpeedX >= 0) {
            iSpeedX = m;
          } else {
            iSpeedX = -m;
          }
        }
        if (iSpeedY) {
          if (Math.abs(iSpeedY) > m) {
            if (iSpeedY >= 0) {
              iSpeedY = m;
            } else {
              iSpeedY = -m;
            }
          }
        }
        callback(that, iSpeedX, iSpeedY);
      };
    };
  };
  if (bool && speedX && speedY) {
    var speedX = speedX;
    var speedY = speedY;
    hitMove(this, speedX, speedY);
    event(this, hitMove);
  } else if (bool && speedX) {
    var speedX = speedX;
    var speedY = g;
    hitMove(this, speedX, speedY);
    event(this, hitMove);
  } else if (bool) {
    var speedX = 0;
    var speedY = g;
    hitMove(this, speedX, speedY);
    event(this, hitMove);
  } else {
    event(this, hitMove);
  }
};
//封装函数实现为指定元素生成轮播图功能/////////////////////////////////////////////////////
//函数接受一个对象参数，对象的属性名为图片路径， 属性值为图片href指向/////////////////////////
Element.prototype.toBeASlowingMap = function(json) {
  clearInterval(this.timer);
  this.style.position = "relative";
  this.style.left = this.offsetLeft + "px";
  this.style.top = this.offsetTop + "px";
  this.style.margin = "0";
  this.style.userSelect = "none";
  this.style.overflow = "hidden";
  var that = this;
  var indexNum = 0;
  var ul = document.createElement("ul");
  ul.style.position = "absolute";
  ul.style.left = "0px";
  var center = document.createElement("div");
  center.style.position = "absolute";
  center.style.width = "100%";
  center.style.bottom = "0px";
  var pageNum = 0;
  for (var prop in json) {
    if (json.hasOwnProperty(prop)) {
      pageNum++;
      var img = document.createElement("img");
      img.src = prop;
      img.style.height = this.clientHeight + "px";
      img.style.width = this.clientWidth + "px";
      img.onmousedown = function(e) {
        e.preventDefault();
      };
      var a = document.createElement("a");
      a.href = json[prop];
      a.target = "_blank";
      a.appendChild(img);
      var li = document.createElement("li");
      li.appendChild(a);
      ul.appendChild(li);
      li.style.float = "left";
      var span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.width = this.clientWidth / 50 + "px";
      span.style.height = this.clientWidth / 50 + "px";
      span.style.lineHeight = (this.clientWidth / 50) * 3 + "px";
      span.style.margin = this.clientWidth / 50 + "px";
      span.style.borderRadius = this.clientWidth / 50 + "px";
      span.style.backgroundColor = "#424242";
      center.appendChild(span);
    }
  }
  center.style.textAlign = "center";
  var showIndexNum = document.createElement("span");
  showIndexNum.style.position = "absolute";
  showIndexNum.style.right = "0px";
  showIndexNum.style.bottom = this.clientWidth / 50 + "px";
  showIndexNum.style.width = this.clientWidth / 15 + "px";
  showIndexNum.style.height = this.clientWidth / 30 + "px";
  showIndexNum.style.textAlign = "center";
  showIndexNum.style.lineHeight = this.clientWidth / 30 + "px";
  showIndexNum.style.fontSize = this.clientWidth / 40 + "px";
  showIndexNum.innerHTML = indexNum + 1 + "/" + pageNum;
  var lastPageNum = pageNum + 1;
  for (var prop in json) {
    if (json.hasOwnProperty(prop)) {
      pageNum++;
      if (pageNum == lastPageNum) {
        var img = document.createElement("img");
        img.src = prop;
        img.style.height = this.clientHeight + "px";
        img.style.width = this.clientWidth + "px";
        var a = document.createElement("a");
        a.href = json[prop];
        a.target = "_blank";
        a.appendChild(img);
        var li = document.createElement("li");
        li.appendChild(a);
        ul.appendChild(li);
        li.style.float = "left";
      }
    }
  }
  ul.style.height = this.clientHeight + "px";
  ul.style.width = this.clientWidth * lastPageNum + "px";
  var left = document.createElement("div");
  left.className = "left";
  left.innerHTML = "<";
  left.style.width = this.clientHeight / 10 + "px";
  left.style.height = this.clientHeight / 10 + "px";
  left.style.lineHeight = this.clientHeight / 10 + "px";
  left.style.textAlign = "right";
  left.style.color = "#ccc";
  left.style.fontSize = this.clientHeight / 14 + "px";
  left.style.borderRadius = this.clientHeight / 10 + "px";
  left.style.backgroundColor = "#000";
  left.style.opacity = "0.5";
  left.style.position = "absolute";
  left.style.left = -this.clientHeight / 10 / 2 + "px";
  left.style.cursor = "pointer";
  left.style.userSelect = "none";
  left.style.top = this.clientHeight / 2 - this.clientHeight / 10 / 2 + "px";
  var right = document.createElement("div");
  right.className = "right";
  right.innerHTML = ">";
  right.style.width = this.clientHeight / 10 + "px";
  right.style.height = this.clientHeight / 10 + "px";
  right.style.lineHeight = this.clientHeight / 10 + "px";
  right.style.textAlign = "left";
  right.style.color = "#ccc";
  right.style.fontSize = this.clientHeight / 14 + "px";
  right.style.borderRadius = this.clientHeight / 10 + "px";
  right.style.backgroundColor = "#000";
  right.style.opacity = "0.5";
  right.style.position = "absolute";
  right.style.right = -this.clientHeight / 10 / 2 + "px";
  right.style.cursor = "pointer";
  right.style.userSelect = "none";
  right.style.top = this.clientHeight / 2 - this.clientHeight / 10 / 2 + "px";
  this.appendChild(ul);
  this.appendChild(left);
  this.appendChild(right);
  this.appendChild(center);
  this.appendChild(showIndexNum);
  var index = center.children;
  index[0].style.backgroundColor = "#fff";
  this.onmouseenter = function() {
    left.style.opacity = "1";
    right.style.opacity = "1";
  };
  this.onmouseleave = function() {
    left.style.opacity = "0.5";
    right.style.opacity = "0.5";
  };
  var first,
    clickKey = false;
  that.onmousedown = function(e) {
    first = new Date().getTime();
  };
  that.onmouseup = function(e) {
    if (new Date().getTime() - first > 1000) {
      e.target.parentElement.onclick = function() {
        return false;
      };
    }
  };
  left.onclick = function() {
    autoMove("left->right");
  };
  right.onclick = function() {
    autoMove("right->left");
  };
  var timer = null;
  var lock = true;

  function autoMove(direction) {
    if (lock) {
      lock = false;
      clearTimeout(timer);
      if (!direction || direction == "right->left") {
        indexNum++;
        if (indexNum < index.length) {
          changIndexStyle(indexNum);
          showIndexNum.innerHTML = indexNum + 1 + "/" + (lastPageNum - 1);
        } else {
          indexNum = 0;
          changIndexStyle(indexNum);
          showIndexNum.innerHTML = indexNum + 1 + "/" + (lastPageNum - 1);
        }
        moveTo(
          ul,
          {
            left: ul.offsetLeft - that.clientWidth
          },
          function() {
            if (
              parseInt(ul.style.left) <=
              -that.clientWidth * (lastPageNum - 1)
            ) {
              ul.style.left = "0px";
            }
            timer = setTimeout(autoMove, 3000);
            lock = true;
          }
        );
      } else if (direction == "left->right") {
        if (parseInt(ul.style.left) == 0) {
          indexNum = index.length - 1;
          changIndexStyle(indexNum);
          showIndexNum.innerHTML = indexNum + 1 + "/" + (lastPageNum - 1);
          ul.style.left = -that.clientWidth * (lastPageNum - 1) + "px";
        } else {
          indexNum--;
          changIndexStyle(indexNum);
          showIndexNum.innerHTML = indexNum + 1 + "/" + (lastPageNum - 1);
        }
        moveTo(
          ul,
          {
            left: ul.offsetLeft + that.clientWidth
          },
          function() {
            timer = setTimeout(autoMove, 3000);
            lock = true;
          }
        );
      }
    }
  }
  timer = setTimeout(autoMove, 3000);

  function moveTo(obj, json, callback) {
    clearInterval(obj.timer);
    var temp, iValue;
    obj.timer = setInterval(function() {
      var key = true;
      iValue = obj.offsetLeft;
      temp = (json.left - obj.offsetLeft) / 2;
      temp = temp > 0 ? Math.ceil(temp) : Math.floor(temp);
      obj.style.left = iValue + temp + "px";
      if (iValue !== json.left) {
        key = false;
      }
      if (key) {
        callback();
        clearInterval(obj.timer);
      }
    }, 30);
  }

  function changIndexStyle(num) {
    for (var i = 0, len = index.length; i < len; i++) {
      index[i].style.backgroundColor = "#424242";
    }
    index[num].style.backgroundColor = "#fff";
  }
  for (var i = 0, len = index.length; i < len; i++) {
    (function(j) {
      index[j].onclick = function() {
        if (lock) {
          clearTimeout(timer);
          lock = false;
          indexNum = j;
          changIndexStyle(indexNum);
          showIndexNum.innerHTML = indexNum + 1 + "/" + (lastPageNum - 1);
          moveTo(
            ul,
            {
              left: -j * that.clientWidth
            },
            function() {
              lock = true;
              timer = setTimeout(autoMove, 3500);
            }
          );
        }
      };
    })(i);
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//一些es5新增数组方法的源码实现及其他数组方法///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//存在满足方法，返回一个布尔值
Array.prototype.mySome = function(fn) {
  var key = true;
  for (var i = 0; i < this.length; i++) {
    key += fn(this[i], i, this);
  }
  if (key == 1) {
    return false;
  } else {
    return true;
  }
};
//全部满足方法，返回一个布尔值
Array.prototype.myEvery = function(fn) {
  var key = true;
  for (var i = 0; i < this.length; i++) {
    key += fn(this[i], i, this);
  }
  if (key == i + 1) {
    return true;
  } else {
    return false;
  }
};
//迭代方法操作原数组，没有返回值
Array.prototype.myForEach = function(fn) {
  for (var i = 0; i < this.length; i++) {
    fn(this[i], i, this);
  }
};
//筛选方法，返回一个元素是原数组并且符合指定条件的新数组
Array.prototype.myFilter = function(fn) {
  var arr = [];
  var deepClone = function(Origin, Target) {
    for (var prop in Origin) {
      if (Origin.hasOwnProperty(prop)) {
        if (typeof Origin[prop] == "object") {
          Target[prop] =
            Object.prototype.toString.call(Origin[prop]) === "object Array"
              ? []
              : {};
          deepClone(Origin[prop], Target[prop]);
        } else {
          Target[prop] = Origin[prop];
        }
      }
    }
    return Target;
  };
  for (var i = 0; i < this.length; i++) {
    if (fn(this[i], i, this)) {
      if (typeof this[i] == "object") {
        arr.push(deepClone(this[i], {}));
      } else {
        arr.push(this[i]);
      }
    }
  }
  return arr;
};
//映射方法，返回一个包含将原数组所有元素进行指定计算后的新数组
Array.prototype.myMap = function(fn) {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    arr.push(fn(this[i], i, this));
  }
  return arr;
};
//压缩方法， 返回一个将原数组自左向右的各项以指定方式合并成为的值
Array.prototype.myReduce = function(fn, init) {
  if (init == undefined) {
    var ret = this[0];
    for (var i = 1; i < this.length; i++) {
      ret = fn(ret, this[i], i, this);
    }
  } else {
    var ret = init;
    for (var i = 0; i < this.length; i++) {
      ret = fn(ret, this[i], i, this);
    }
  }
  return ret;
};
//压缩方法， 返回一份将原数组自右向左的各项以指定方式合并成为的值
Array.prototype.myReduceRight = function(fn, init) {
  if (init == undefined) {
    var ret = this[this.length - 1];
    for (var i = this.length - 2; i >= 0; i--) {
      ret = fn(ret, this[i], i, this);
    }
  } else {
    var ret = init;
    for (var i = this.length - 1; i >= 0; i--) {
      ret = fn(ret, this[i], i, this);
    }
  }
  return ret;
};
//其他的数组方法///////////////////////////////////////////////////////////////////////////
// 数组方法.push()的实现方法
Array.prototype.myPush = function() {
  for (var i = 0, len = arguments.length; i < len; i++) {
    this[this.length] = arguments[i];
    this.length++;
  }
  return this.lentgth;
};
//数组去重的几种方法
function unique1(array) {
  var arr = [];
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (arr.indexOf(array[i]) == -1) {
      arr.push(array[i]);
    }
  }
  return arr;
}

function unique2(array) {
  var arr = [];
  var len = array.length;
  for (var i = 0; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (array[j] == array[i]) {
        j = ++i;
      }
    }
    arr.push(array[i]);
  }
  return arr;
}

function unique3(array) {
  var arr = [];
  var len = array.length;
  var obj = {};
  for (var i = 0; i < len; i++) {
    if (!obj[array[i]]) {
      obj[array[i]] = 1;
      arr.push(array[i]);
    }
  }
  return arr;
}

function unique4(array) {
  var arr = [array[0]];
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i] != arr[arr.length - 1]) {
      arr.push(array[i]);
    }
  }
  return arr;
}
//字符串去重
function stringUnique() {
  var arr = this.split("");
  var temp = {};
  var string = "";
  for (var i = 0, len = arr.length; i < len; i++) {
    if (!temp[arr[i]]) {
      temp[arr[i]] = 1;
      string += arr[i];
    }
  }
  return string;
}

//获取字符串的字节长度
String.prototype.getBytes = function() {
  var len = this.lengh;
  var num = len;
  for (var i = 0; i < len; i++) {
    if (this.charCodeAt(i) > 255) {
      num++;
    }
  }
  return num;
};
console.log(123);
// type类型判断
function type(Target) {
  var template = {
    "[object Array]": "array",
    "[object Object]": "object",
    "[object String]": "string - object",
    "[object Nember]": "number - object",
    "[object Boolean]": "boolean - object"
  };
  if (Target == null) {
    return "null";
  } else if (typeof Target == "object") {
    return template[Object.prototype.toString.call(Target)];
  } else {
    return typeof Target;
  }
}

//封装函数实现返回滚动条滚动距离的兼容性方法
function getScrollOffset() {
  if (!window.pageYOffset) {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  } else {
    return {
      x: document.documentElement.scrollLeft + document.body.scrollLeft,
      y: document.documentElement.scrollTop + document.body.scrollTop
    };
  }
}

//封装函数实现返回浏览器视口尺寸的兼容性方法
function getViewportOffset() {
  if (window.innerWidth) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  } else {
    if (document.compatMode === "BackCompat") {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      };
    } else {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    }
  }
}

//封装函数实现异步加载js
function downJs(src, callback) {
  var script = document.createEllement("script");
  script.type = "text/javascript";
  if (script.readdyState) {
    script.onreadystatechange = function() {
      if (script.readdyState == "complate" || script.readdyState == "loaded") {
        callback();
      }
    };
  } else {
    script.onload = function() {
      callback();
    };
  }
  script.src = src;
}
