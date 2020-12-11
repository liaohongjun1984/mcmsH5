var stat = 0;
var selectNum = 0;
var page = 0;
var typeTag = 'ONEPRICE';
$(function() {
    listShareMarket(page);
    // if(getCookie("token")){
    //     getCustomersFund(function(data){
    //         console.log("getCustomersFund:",data);
    //         userFund = data;
            
    //     });
    // }
        
})

function selectTab(self,num){
    selectNum = num;
    if(num == 0 || num == 1){
        stat = 0;
        if(num == 0){
            typeTag = 'ONEPRICE';
        }else if(num == 1){
            typeTag = 'BID';
        }
        $(".btnBox .btn").removeClass("active");
        $(self).addClass("active");
        $(".sortGroupBox .flex").removeClass("active");
        $(".sortGroupBox .flex").eq(0).addClass("active");
    }else{
        
        if(num == 2){
            stat = 0;
        }else if(num == 3){
            stat = 1;
        }
        $(".sortGroupBox .flex").removeClass("active");
        $(self).addClass("active");
    }

    listShareMarket(page);

}

function listShareMarket(page) {

    var url = '/api/listShareMarket.do';
    $.ajax({
        type: 'get',
        url: url,
        data: {
            type: typeTag,
            stat: stat,
            page: page,
            size: 10
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                if (obj == '') {
                    if (page == 0) {

                        if(typeTag == 'ONEPRICE'){
                            $(".showList").html('<div class="noDataMsg">暂无餐厅份额出售</div>');
                        }else{
                            $(".showList").html('<div class="noDataMsg">暂无餐厅份额竞拍</div>');
                        }
                        
                    }
                    return
                }

                var html = '';
                if(typeTag == 'ONEPRICE'){
                    html += '<div class="row flex">';
                    html += '    <div style="width:160px">餐厅</div>';
                    html += '    <div style="width:70px">份额</div>';
                    html += '    <div style="width:130px">单价</div>';
                    html += '    <div style="width:180px">总价</div>';
                    html += '    <div style="flex:1;text-align: right;">挂单时间</div>';
                    html += '</div>';
                }else{
                    

                    html += '<div class="row flex">';
                    html += '    <div style="width:160px">餐厅</div>';
                    html += '    <div style="width:70px">份额</div>';
                    if(stat == 0){
                        html += '    <div style="width:130px">最高出价</div>';
                        html += '    <div style="width:140px">起始价</div>';
                        html += '    <div style="width:80px">出售者</div>';

                    }else{

                        html += '    <div style="width:130px">成交价</div>';
                        html += '    <div style="width:80px">竞拍者</div>';

                    }
                    html += '    <div style="flex:1;text-align:right;">结束时间</div>';
                    html += '</div>';
                }

                // baseBidPrice: 1000
                // bidExpireDate: 1605283199000
                // bidStep: 200
                // bidderId: 0
                // createDate: 1605265827000
                // curPrice: 0
                // customerId: 338
                // id: 76
                // marketType: "BID"
                // name: "BARBER芥末男士"
                // projectId: 2
                // shareAmount: 1
                // stat: 0
                $.each(obj, function(i, n) {

                    var rowClass = 'row2';
                    var moneyTag = '';

                    if (i % 2 == 0) {
                        rowClass = 'row1';
                    }
                    if(typeTag == 'ONEPRICE'){
                        html += '<a href="shop.html?id='+ n.id+'">';
                        html += '<div class="'+ rowClass +' flex">';
                        html += '    <div style="width:160px">'+ n.name +'</div>';
                        html += '    <div style="width:70px">'+ n.shareAmount +'</div>';
                        html += '    <div style="width:130px">'+ n.curPrice +'</div>';
                        html += '    <div style="width:180px">'+ Number(n.curPrice * n.shareAmount) +'</div>';
                        html += '    <div style="flex:1;text-align: right;">' + new Date(n.createDate).Format('yyyy-MM-dd') + '</div>';
                        html += '</div>';
                        html += '</a>';
                    }else{


                        var price = 0.0;
                        if(n.curPrice == 0){
                            price =  n.baseBidPrice;
                        }else{
                            price =  n.curPrice;
                        }
                        
                        html += '<a href="shop.html?id='+ n.id+'">';
                        html += '<div class="'+ rowClass +' flex">';
                        html += '    <div style="width:160px">'+ n.name +'</div>';
                        html += '    <div style="width:70px">'+ n.shareAmount +'</div>';
                        html += '    <div style="width:130px">'+ price +'</div>';
                        if(stat == 0){
                            html += '    <div style="width:140px">'+n.baseBidPrice+'</div>';
                            html += '    <div style="width:80px">'+ n.sellerHide +'</div>';

                        }else{

                            html += '    <div style="width:80px">'+n.bidderHide+'</div>';

                        }
                        html += '    <div style="flex:1;text-align:right;">' + new Date(n.bidExpireDate).Format('yyyy-MM-dd') + '</div>';
                        html += '</div>';
                        html += '</a>';

                    }
    // <div class="row flex" wx:if="{{projectList.length > 0}}">
    //     <div style="width:160px">餐厅</div>
    //     <div style="width:70px">份额</div>
    //     <div style="width:130px" wx:if="{{ONEPRICE == true}}">单价</div>
    //     // <div style="width:130px" wx:else>{{BIDCHECK == 0 ? '现价':'成交价'}}</div>

    //     <div style="width:180px" wx:if="{{ONEPRICE == true}}">总价</div>
    //     // <div style="width:80px" wx:else>{{BIDCHECK == 0 ? '出售者':'竞拍者'}}</div>

    //     // <div style="width:140px" wx:if="{{ONEPRICE == false && BIDCHECK == 0}}">当前最高出价</div>
    //     <div style="flex:1;text-align: right;">{{ONEPRICE == true ? '挂单时间':'结束时间'}}</div>
    // </div>




                    // html += '<a class="itemBox" href="projectDetail.html?id='+ n.id +'">';
                    // html += '    <img class="imgs" src="'+ n.logo +'">';
                    // html += '    <div class="itemContent">';
                    // html += '        <div class="title">'+ n.name +'</div>';
                    // html += '        <div class="tips">'+ n.addr +'</div>';
                    // html += '        <div class="content">'+ n.description +'</div>';
                    // html += '    </div>';
                    // html += '</a>';

                })
                if(page == 0){
                    $(".showList").html(html);
                }else{
                    $(".showList").append(html);
                }
            } else {
                alert(data.message)
            }
        }
    });
}
