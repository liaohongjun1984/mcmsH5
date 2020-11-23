/**
 * @author pudding_dy
 */
$(function() { //TODO
    //底部 链接
    hrefGo();

    //fixTop toTop pos common.css
    $(window).scroll(function() {
        var sT = $(window).scrollTop();
        if (sT >= $(document).height() - $(window).height()) {
            var str = '<div id="spaceH" style="height: ' + ($('footer').height() + 10) + 'px"></div>';
            if ($('#spaceH').length == 0) {
                $('body').append(str);
            }
        }
    });
});

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + escape(cvalue) + "; " + expires + ";path=/";
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        var res = c.substring(name.length, c.length);
        if (c.indexOf(name) != -1) return unescape(res);
    }
    return "";
}
//清除cookie  
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//获取URL的参数
function getURLPara(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function showMsg(content) {
    if ($('#msg').length == 0) {
        var str = '<div id="msg" class="msgCon hide">' +
            '<p class="msg">--</p>' +
            '</div>';
        $('body').append(str);
    }
    $("#msg .msg").html(content);
    $("#msg").removeClass('hide').show();
    setTimeout('$("#msg").fadeOut()', 2500);
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg) {
    return accAdd(arg, this);
};


/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.sub = function(arg) {
    return accMul(arg, this);
};


/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg) {
    return accMul(arg, this);
};



/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function(arg) {
    return accDiv(this, arg);
};

//阻止事件冒泡
function stopEventBubble(event) {
    var e = event || window.event;
    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
if (!$d) {
  var $d = {};
}
$d.encodeBase64Url = function(str) {
  if (typeof str !== 'string') {
    return null;
  }
  str = $d.encodeBase64(str);
  str = str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return str;
};
$d.decodeBase64Url = function(str) {
  if (typeof str !== 'string') {
    return null;
  }
  var mod = str.length % 4;
  if (mod !== 0) {
    str += $d.repeat('=', 4 - mod);
  }
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  str = $d.decodeBase64(str);
  return str;
};
$d.repeat = function(str, num) {
  return new Array(num + 1).join(str);
};
$d.encodeBase64 = function(str) {
  if (typeof str !== 'string') {
    return null;
  }
  str = (str + '').toString();
  var strReturn = '';
  if (window.btoa) {
    strReturn = window.btoa(unescape(encodeURIComponent(str)));
  } else {
    strReturn = $d.encodeBase64Fallback(str);
  }
  return strReturn;
};
$d.decodeBase64 = function(str) {
  if (typeof str !== 'string') {
    return null;
  }
  str = (str + '').toString();
  var strReturn = '';
  if (window.atob) {
    strReturn = decodeURIComponent(escape(window.atob(str)));
  } else {
    strReturn = $d.decodeBase64Fallback(str);
  }
  return strReturn;
};
$d.encodeBase64Fallback = function(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data = unescape(encodeURIComponent(data));

  do {
    // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};
$d.decodeBase64Fallback = function(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do {
    // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
};

function hrefGo() {
    if (window.location.pathname.indexOf("/article.html") > -1 || 
        window.location.pathname.indexOf("/forget.html") > -1 ) {
        return
    }
    var active = 'active';
    var active1 = '', active2 = '', active3 = '', active4 = '';
    var html = '';


    if (window.location.pathname.indexOf("/project.html") > -1) {
        active2 = active;
    } else if (window.location.pathname.indexOf("/transaction.html") > -1) {
        active3 = active;
    } else if (window.location.pathname.indexOf("/user.html") > -1) {
        active4 = active;
    } else {
        active1 = active;
    }
    html += '<ul class="flex">';
    html += '    <a href="index.html">';
    html += '        <li class="' + active1 + '">';
    html += '            <img src="imgs/nav_01'+ (active1 == '' ? '':'_true') +'.png" alt=""><br>';
    html += '            热门';
    html += '        </li>';
    html += '    </a>';
    html += '    <a href="project.html">';
    html += '        <li class="' + active2 + '">';
    html += '            <img src="imgs/nav_02'+ (active2 == '' ? '':'_true') +'.png" alt=""><br>';
    html += '            项目';
    html += '        </li>';
    html += '    </a>';
    html += '    <a href="transaction.html">';
    html += '        <li class="' + active3 + '">';
    html += '            <img src="imgs/nav_03'+ (active3 == '' ? '':'_true') +'.png" alt=""><br>';
    html += '            交易';
    html += '        </li>';
    html += '    </a>';
    html += '    <a href="user.html">';
    html += '        <li class="' + active4 + '">';
    html += '            <img src="imgs/nav_04'+ (active4 == '' ? '':'_true') +'.png" alt=""><br>';
    html += '            我的';
    html += '        </li>';
    html += '    </a>';
    html += '</ul>';
    $('footer').html(html);
}

function getCustomersMsg(fun){

    $.ajax({
        type: 'get',
        url: '/api/game/customers.do',
        headers: {
            'Authorization':"BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object;
                if (!obj) {
                    return
                }else{
                    fun(obj);
                }
            } else {
                alert(data.message)
            }
        }
    });
}
function getCustomersFund(fun){

    $.ajax({
        type: 'get',
        url: '/api/getFund.do',
        headers: {
            'Authorization':"BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object;
                if (!obj) {
                    return
                }else{
                    fun(obj);
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function getCapitalizedAmount(num){
    var fuhao = "";
    var text = num + "";
    if (text.indexOf("-") > -1) {
        num = text.replace("-", "");
        fuhao = "负"
    }
    var money1 = new Number(num);
    var monee = Math.round(money1 * 100).toString(10);
    var leng = monee.length;
    var monval = "";
    for (var i = 0; i < leng; i++) {
        monval = monval + to_upper(monee.charAt(i)) + to_mon(leng - i - 1)
    }
    return fuhao + repace_acc(monval)
}
// 将数字转为大写的中文字
function to_upper(a){
    switch (a) {
      case "0":
          return "零";
          break;
      case "1":
          return "壹";
          break;
      case "2":
          return "贰";
          break;
      case "3":
          return "叁";
          break;
      case "4":
          return "肆";
          break;
      case "5":
          return "伍";
          break;
      case "6":
          return "陆";
          break;
      case "7":
          return "柒";
          break;
      case "8":
          return "捌";
          break;
      case "9":
          return "玖";
          break;
      default:
          return ""
    }

}
// 将数字转为大写的中文字

function to_mon(a){
    if (a > 10) {
        a = a - 8;
        return (to_mon(a))
    }
    switch (a) {
    case 0:
        return "分";
        break;
    case 1:
        return "角";
        break;
    case 2:
        return "元";
        break;
    case 3:
        return "拾";
        break;
    case 4:
        return "佰";
        break;
    case 5:
        return "仟";
        break;
    case 6:
        return "万";
        break;
    case 7:
        return "拾";
        break;
    case 8:
        return "佰";
        break;
    case 9:
        return "仟";
        break;
    case 10:
        return "亿";
        break
    }
}

// 将数字转为大写的中文字
function repace_acc(Money){

    Money = Money.replace("零分", "");
    Money = Money.replace("零角", "零");
    var yy;
    var outmoney;
    outmoney = Money;
    yy = 0;
    while (true) {
        var lett = outmoney.length;
        outmoney = outmoney.replace("零元", "元");
        outmoney = outmoney.replace("零万", "万");
        outmoney = outmoney.replace("零亿", "亿");
        outmoney = outmoney.replace("零仟", "零");
        outmoney = outmoney.replace("零佰", "零");
        outmoney = outmoney.replace("零零", "零");
        outmoney = outmoney.replace("零拾", "零");
        outmoney = outmoney.replace("亿万", "亿零");
        outmoney = outmoney.replace("万仟", "万零");
        outmoney = outmoney.replace("仟佰", "仟零");
        yy = outmoney.length;
        if (yy == lett) {
            break
        }
    }
    yy = outmoney.length;
    if (outmoney.charAt(yy - 1) == "零") {
        outmoney = outmoney.substring(0, yy - 1)
    }
    yy = outmoney.length;
    if (outmoney.charAt(yy - 1) == "元") {
        outmoney = outmoney + "整"
    }
    return outmoney
}


