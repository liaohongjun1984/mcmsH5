var userMsg = '';
var userFund = '';
var selectNum = 0;
var totalNum = 1;
var selectType = 0;
var projectId = 

$(function() {
    if (!getCookie("token")) {
        $("#loginShow").show();
    } else {
        getCustomersMsg(function(data) {
            console.log("getCustomersMsg:", data);
            userMsg = data;
            $(".userMsg .name").html(userMsg.decryptNick + ' （' + userMsg.telNumberHide + '）');
            if (userMsg.headimgurl) {
                $(".userBox .userImgs").html('<img src="' + userMsg.headimgurl + '" alt="">');
            }
            $(".vipBox .vipLevel").html(userMsg.level);

        });
        getCustomersFund(function(data) {
            console.log("getCustomersFund:", data);
            userFund = data;
            $(".userContent .moneyCount").html(userFund.amount);

        });
        listCustomerProject(0);
        listCustomerCupons(0);

    }
    var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    //滚动条滚动距离
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    //窗口可视范围高度
    var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);

    console.log(clientHeight,scrollTop,scrollHeight)
    if (clientHeight + scrollTop >= scrollHeight) {
        console.log("===加载更多内容……===");
    }

})




function Login() {
    var telNumber = $("#telNumber").val();
    var password = $("#password").val();
    if (telNumber == '') {
        showMsg("账号不能为空");
        return
    }
    if (password == '') {
        showMsg("请输入密码");
        return
    }
    $.ajax({
        type: 'post',
        url: '/api/users/token.do',
        dataType: 'json',
        data: {
            telNumber: telNumber,
            password: password
        },
        success: function(data) {
            if (data.code == 200) {
                var token = data.object;
                var units = token.split(".");
                var jwt_payload = JSON.parse($d.decodeBase64Url(units[1]));
                var time_cookie = (jwt_payload.exp - jwt_payload.iat) / 3600000;
                setCookie('token', token, time_cookie / 24);
                var date_obj = new Date();
                setTimeout(function() {
                    window.location.href = "user.html";
                }, 500);
            } else {
                alert(data.message);
            }
        },
        error: function(data) {
            //判断token是否有效
            if (data.status == 401) {
                alert(data.message);
            }
        }
    });
}

function listCustomerProject(page) {

    $.ajax({
        type: 'get',
        url: '/api/listCustomerProject.do',
        data: {
            page: page,
            size: 10
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                if (obj == '') {
                    if (page == 0) {
                        $(".showList").html('<div class="noDataMsg">您还没拥有店铺</div>')
                    }
                    return
                } else {

                    if (data.object.totalElements == 0) {
                        $(".userMsg .tips").html('你还没有拥有餐厅');
                    } else {
                        $(".userMsg .tips").html('共投资 ' + data.object.totalElements + ' 间餐厅');
                    }

                    var html = '';
                    $.each(obj, function(i, n) {
                        html += '<div class="itemBox">';
                        html += '    <img class="imgs" src="' + n.projectLogo + '">';
                        html += '    <div class="itemContent">';
                        html += '        <div class="title">' + n.projectName + '</div>';
                        html += '        <div class="tips">拥有份额：' + n.shareAmount + '</div>';
                        html += '        <div class="saleBtn" onclick="saleShopShow('+ n.projectId +',\''+ n.projectName +'\',' + n.shareAmount + ')">出售</div>';
                        html += '    </div>';
                        html += '</div>';
                    })
                    if (page == 0) {
                        $(".showList").html(html);
                    } else {
                        $(".showList").append(html);
                    }

                }
            } else {
                alert(data.message)
            }
        }
    });
}

function listCustomerFundFlow(page) {

    $.ajax({
        type: 'get',
        url: '/api/listCustomerFundFlow.do',
        data: {
            page: page,
            size: 10
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                if (obj == '') {
                    if (page == 0) {
                        $(".showList").html('<div class="noDataMsg">您还没有资金流水</div>')
                    }
                    return
                } else {

                    // afterChange: 20000
                    // beforeChange: 40000
                    // createDate: 1605176296000
                    // customerId: 338
                    // fundType: "BUY_PROJECT"
                    // id: 776
                    // income: 0
                    // outcome: 20000

                    // 

                    var html = '';
                    html += '<div class="row flex">';
                    html += '    <div style="flex:1">创建时间</div>';
                    html += '    <div style="width:190px">金额</div>';
                    html += '    <div style="width:160px">类型</div>';
                    html += '</div>';
                    $.each(obj, function(i, n) {
                        var rowClass = 'row2';
                        var monetTag = '';

                        if (i % 2 == 0) {
                            rowClass = 'row1'
                        }
                        if(n.income > 0){
                            monetTag = '+ ￥' + n.income;
                        }else{
                            monetTag = '- ￥' + n.outcome;
                        }
                        html += '<div class="' + rowClass + ' flex">';
                        html += '    <div style="flex:1">' + new Date(n.createDate).Format('yyyy-MM-dd hh:mm:ss') + '</div>';
                        html += '    <div style="width:190px">'+ monetTag +'</div>';
                        html += '    <div style="width:160px">'+ getMoneyType(n.fundType) +'</div>';
                        html += '</div>';
                    })
                    if (page == 0) {
                        $(".showList").html(html);
                    } else {
                        $(".showList").append(html);
                    }
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function getMoneyType(type) {
    switch (type) {
        case "INCOME":
            tag = '收入'
            break;
        case "OUTCOME":
            tag = '支出'
            break;
        case "BID":
            tag = '竞标'
            break;
        case "BID_RETURN":
            tag = '竞标失败'
            break;
        case "BUY_PROJECT":
        case "BUY_MARKET":
            tag = '购买项目'
            break;
        case "SELL_MARKET":
            tag = '出售项目'
            break;
        default:
            tag = '未知类型'
    }
    return tag
}

function selectTab(num, self) {
    page = 0;
    $(".userBtnBox .btn").removeClass("active");
    $(self).addClass("active");
    selectNum = num;
    if (num == 0) {
        listCustomerProject(page);
    } else if (num == 1) {
        listCustomerFundFlow(page);
    } else if (num == 2) {
        listCustomerShareMarket(page);
    } else if (num == 3) {
        listCustomerCupons(page);
    }
}

function listCustomerShareMarket(page) {

    $.ajax({
        type: 'get',
        url: '/api/listCustomerShareMarket.do',
        data: {
            page: page,
            size: 10
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                if (obj == '') {
                    if (page == 0) {
                        $(".showList").html('<div class="noDataMsg">您还没有出售店铺份额</div>')
                    }
                    return
                } else {

                    var html = '';
                    html += '<div class="row flex">';


                    html += '   <div style="width:203px">店铺</div>';
                    html += '   <div style="width:80px">份额</div>';
                    html += '   <div style="flex:1">时间</div>';
                    html += '   <div style="width:180px">总金额</div>';
                    html += '   <div style="width:150px">操作</div>';

                    html += '</div>';



                    $.each(obj, function(i, n) {
                        var rowClass = 'row2';
                        var moneyTag = '';

                        if (i % 2 == 0) {
                            rowClass = 'row1';
                        }

                        if(n.curPrice > n.baseBidPrice){
                            moneyTag = '￥' + n.curPrice;
                        }else{
                            moneyTag = '￥' + n.baseBidPrice;
                        }

                        html += '<div class="' + rowClass + ' flex">';

                        html += '<div class="item" style="width:203px">'+ n.name +'</div>';
                        html += '<div class="item" style="width:80px">'+ n.shareAmount +'份</div>';
                        html += '<div class="item" style="flex:1">' + new Date(n.createDate).Format('yy-MM-dd') + '</div>';
                        html += '<div class="item" style="width:180px">'+ moneyTag +'</div>';
                        html += '<div style="width:150px;overflow:auto;"><div onclick="unsaleShare('+ n.id +')" class="unsaleBtn">下架</div></div>';

                        html += '</div>';
                    })

                    if (page == 0) {
                        $(".showList").html(html);
                    } else {
                        $(".showList").append(html);
                    }
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function unsaleShare(id){

    $.ajax({
        type: 'post',
        url: '/api/unSaleShare.do',
        data: {
            marketId: id
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                showMsg("下架成功");
                listCustomerShareMarket(0);
            } else {
                alert(data.message)
            }
        }
    });
}
function listCustomerCupons(page) {

    $.ajax({
        type: 'get',
        url: '/api/listCustomerCupons.do',
        data: {
            page: page,
            size: 10
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                $(".cuponCount").html(data.object.totalElements);
                if(selectNum != 3){
                    return
                }
                if (obj == '') {
                    if (page == 0) {
                        $(".showList").html('<div class="noDataMsg">您还没有店铺的优惠券</div>')
                    }
                    return
                } else {

                    var html = '';
                    $.each(obj, function(i, n) {

                        html += '<div class="row1 flex">';
                        html += '   <div style="flex:1;" class="flex">';
                        html += '       <img src="imgs/cupon.png" style="width:80px;height:80px">';
                        html += '       <div style="flex:1;margin-left:28px;" class="flex">';
                        html += '           <div>￥</div>';
                        html += '           <div style="color:#df3636;font-size:42rpx;">'+ n.amount +'</div>';
                        html += '           <div style="flex:1"></div>';
                        html += '       </div>';
                        html += '   </div>';
                        html += '   <div style="flex:1;margin:15px 25px;text-align:right;">';
                        html += '       <div style="line-height:50px">店铺：'+ n.name +'</div>';
                        html += '       <div style="line-height:50px">有效期至 '+ new Date(n.expireDate).Format('yyyy-MM-dd') +'</div>';
                        html += '   </div>';
                        html += '</div>';

                    })
                    if (page == 0) {
                        $(".showList").html(html);
                    } else {
                        $(".showList").append(html);
                    }
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function saleShopShow(id,name,share){
    // $("#saleShareNum").val(0);
    // $(".saleMyShop").show();
    // $(".bidFalse").show();
    // $(".bidTrue").hide();
    projectId = id;
    $(".projectName").html(name);
    $(".shareAmount").html(share);
    selectNum = 0;
    totalNum = share;
    selectTypeShow(0);
    $("#saleMyShop").show();
}
function selectTypeShow(num){
    selectType = num;
    if(num == 0){
        $("#saleShareNum").val(0);
        $(".bidFalse").show();
        $(".bidTrue").hide();
        $("#selectTag img").eq(1).attr("src","imgs/check_01.png");
    }else{
        $("#saleShareNum").val(0);
        $(".bidFalse").hide();
        $(".bidTrue").show();
        $("#selectTag img").eq(0).attr("src","imgs/check_01.png");
    }
    $("#selectTag img").eq(num).attr("src","imgs/check_02.png");
}


function minusCount(){
    var num = selectNum - 1;
    if(num > -1){
        $(".shop-number-right-input").html(num);
        selectNum = num;
        $(".shop-number-right-plus").removeClass("disable-btn");
    }else{
        return
    }
    if(num == 0){
        $(".shop-number-right-reduce").addClass("disable-btn");
    }else{
        $(".shop-number-right-reduce").removeClass("disable-btn");
    }

}
function addCount(){
    var num = selectNum + 1;
    if(num <= totalNum){
        $(".shop-number-right-input").html(num);
        selectNum = num;
        $(".shop-number-right-reduce").removeClass("disable-btn");
    }else{
        return
    }
    if(num == totalNum){
        $(".shop-number-right-plus").addClass("disable-btn");
    }else{
        $(".shop-number-right-plus").removeClass("disable-btn");
    }
}
function saleShare() {
    var money;

    if(selectType == 0){
        money = $("#saleTotalPrice").val();
    }else{
        money = $("#basePrice").val();
    }
    var url = '/api/saleShare.do';
    var selfData = {
      projectId:projectId,
      shareAmount:selectNum,
      price:money
    }
    if(selectNum == 0){
      showMsg("请输入出售份额");
      return
    }
    if(money == ''){
      if(selectType == 1){
        showMsg("请输入起始价格");
      }else{
        showMsg("请输入出售金额");
      }
      return
    }

    if(selectType == 1){
      url = '/api/saleBidShare.do';
      var step = $("#stepPrice").val();
      var date = $("#endDate").val();
      if(step == ''){
        showMsg("请输入递增金额");
        return
      }
      if(date == ''){
        showMsg("请输入结束日期");
        return
      }
      var stepPrice = step;
      selfData = {
        projectId:projectId,
        shareAmount:selectNum,
        basePrice:money,
        stepPrice:stepPrice,
        endDate:date
      }
    }
    $.ajax({
        type: 'post',
        url: url,
        data: selfData,
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                showMsg("上架成功");
                $('#saleMyShop').hide();
                listCustomerProject(0);
            } else {
                alert(data.message)
            }
        }
    });
  


    // if(tag == 'BID'){
    //   url = 'saleBidShare.do';
    //   step = e.detail.value.step;
    //   date = e.detail.value.date;
    //   if(step == ''){
    //     app.alert("请输入递增金额");
    //     return
    //   }
    //   if(date == ''){
    //     app.alert("请输入结束日期");
    //     return
    //   }
    //   var stepPrice = step;
    //   selfData = {
    //     projectId:id,
    //     shareAmount:num,
    //     basePrice:money,
    //     stepPrice:stepPrice,
    //     endDate:date
    //   }
    // }

   
    
    // wx.request({
    //   url: app.globalData.api + url,
    //   method: 'post',
    //   dataType: 'json',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //     'Accept': 'application/json',
    //     'Authorization': "BASIC " + wx.getStorageSync("token")
    //   },
    //   data: selfData,
    //   success: function (res) {
    //     // console.log(res.data);
    //     var data = res.data;
    //     var obj = data.object;
    //     if (data.success) {
    //       app.alert("出售成功");
          
    //     } else {
    //       app.alert(data.message);
    //     }
    //   }
    // })
}

//清除cookie
//1
// window.onbeforeunload = function (){
//     if(window.event.clientY>0||window.event.altKey){
//         window.onbeforeunload = null;
//     }else{
//         alert("推出系统"),
//         $.ajax({
//             type:"post",
//             url:"main?action=logout",
//             data:"",
//             success:function (data){
//             }
//         }
//         );
//     }
// }
//2
// function addCookie(objName,objValue,objHours)
// {
//     var str = objName + "=" + escape(objValue);
//     if(objHours > 0){//等于0时，关闭浏览器自动清除Cookies.
//         var date = new Date();
//         var ms = objHours*3600*1000;
//         date.setTime(date.getTime() + ms);
//         str += "; expires=" + date.toGMTString();
//     }
//     document.cookie = str;
// }
//3

//存储
function setCookie(cname, cvalue, exdays = 0) {
    cvalue = encodeURIComponent(JSON.stringify(cvalue));
    if (exdays > 0) {
      var d = new Date().getTime() + exdays * 24 * 3600 * 1000 + 8 * 3600 * 1000;
      var expires = "expires=" + new Date(d).toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
      document.cookie = cname + "=" + cvalue + ";" + ";path=/";
    }
}
//获取
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
        var c = ca[i];
    for (var i = 0; i < ca.length; i++) {
        while (c.charAt(0) == " ") {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        let d = c.substring(name.length, c.length);
        return JSON.parse(decodeURIComponent(d));
        }
    }
    return "";
}

//删除
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var delValue = getCookie(name);
    if (delValue) {
        document.cookie = name + "=" + delValue + ";expires=" + date.toGMTString();
    }
} 
  

  
//userShopName
//userShopNum
