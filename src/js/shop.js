var stat = 0;
var selectNum = 1;
var userFund = [];
var typeTag = 'ONEPRICE';
var marketType = '0';
var totalNum = '';
var needMoney = '';
var project = {};
$(function() {
    
    getShareMarket();
    if(getCookie("token")){
        getCustomersFund(function(data){
            console.log("getCustomersFund:",data);
            userFund = data;
            $(".myMoney").html(userFund.amount);
        });
    }
})

function showTable(obj){
    var html = '';
    if(obj.marketType == "ONEPRICE"){
        html += '<div class="row flex">';
        html += '  <div style="width:180px">餐厅</div>';
        html += '  <div style="width:80px">份额</div>';
        html += '  <div style="width:130px">单价</div>';
        html += '  <div style="width:180px">总价</div>';
        html += '  <div style="flex:1">挂单时间</div>';
        html += '</div>';

                // $(".showName").html(obj.name);
                // $(".showShareAmount").html(obj.shareAmount);
                // $(".showCurPrice").html(obj.curPrice);
                // $(".showSellerHide").html(obj.sellerHide);
                // $(".showDate").html(obj.createDate);


        html += '<div class="row1 flex">';
        html += '  <div style="width:180px">'+ obj.name +'</div>';
        html += '  <div style="width:80px">'+ obj.shareAmount +'</div>';
        html += '  <div style="width:130px">'+ obj.curPrice +'</div>';
        html += '  <div style="width:180px">'+ obj.curPrice * obj.shareAmount +'</div>';
        html += '  <div style="flex:1">'+ new Date(obj.createDate).Format('yyyy-MM-dd') +'</div>';
        html += '</div>';
    }else{
    }
    $(".showTable").html(html)
}


function minusCount(){
    var num = selectNum - 1;
    if(num > 0){
        $(".shop-number-right-input").html(num);
        selectNum = num;
        $(".shop-number-right-plus").removeClass("disable-btn");
    }else{
        return
    }
    if(num == 1){
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



function getShareMarket() {

    var url = '/api/getShareMarket.do';
    $.ajax({
        type: 'get',
        url: url,
        data: {
            marketId: getURLPara('id')
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object;
                if (!obj) {
                    showMsg("没有数据");
                    return
                }
                project = obj;
                totalNum = obj.shareAmount;
                if(totalNum == 1){
                    $(".shop-number-right-plus").addClass("disable-btn");
                }
                showTable(obj);

                var price = obj.curPrice;
                if(obj.marketType == "BID"){
                    if(obj.curPrice == 0){
                        price = obj.baseBidPrice;
                    }
                }
                project.price = price;
                
                $(".showName").html(obj.name);
                $(".showShareAmount").html(obj.shareAmount);
                $(".showCurPrice").html(price);
                $(".showNeedPrice").html(price  * obj.shareAmount);
                $(".showTotalPrice").html(price * obj.shareAmount);
                $(".showSellerHide").html(obj.sellerHide);
                $(".showDate").html(new Date(obj.createDate).Format('yyyy-MM-dd'));

            // baseBidPrice: 0
            // bidStep: 0
            // bidderId: 0
            // createDate: 1605258413000
            // curPrice: 6666
            // customerId: 338
            // id: 75
            // marketType: "ONEPRICE"
            // name: "江南第一家"
            // projectId: 1
            // shareAmount: 1
            // stat: 0

            } else {
                alert(data.message)
            }
        }
    });
}

function buyProjectShare(){
    if(!getCookie("token")){
        showMsg("请登录再操作");
        return
    }
    var money = $(".showNeedPrice").html();
    var moneyTag = getCapitalizedAmount(money);
    var content = '你确定要花费 ￥' + money + ' 购买餐厅' + project.name + '的份额吗';
    
    $("#buyMsgShow .title").html("购买确认");
    $("#buyMsgShow .msgTips").html(content);
    $("#buyMsgShow .moneyTag").html(moneyTag);

    $("#buyMsgShow").show();
}

function buyShopGo(){

    $.ajax({
        type: 'post',
        url: '/api//buyMarketShare.do',
        data: {
            marketId:project.id,
            shareCount:selectNum,
            price:project.price,
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                showMsg("购买成功");
                location.href="transaction.html";
            } else {
                alert(data.message)
            }
        }
    });
}