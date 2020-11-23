var stat = false;
var userFund = '';
var project = {};
var selectNum = 0;
var selectShareNum = 1;
var share = 1;
var totalNum = 0;
$(function() {
    // listProjects(page);
    getProject();
    if(getCookie("token")){
        getCustomersFund(function(data){
            console.log("getCustomersFund:",data);
            userFund = data;
            
        });
    }
        
})

function selecTab(num){
    if($(".aboutBox .showbox").eq(num).hasClass("active")){
        $(".aboutBox .showbox").eq(num).removeClass("active");
    }else{
        $(".showbox").removeClass("active");
        $(".aboutBox .showbox").eq(num).addClass("active");
    }
    if($(".aboutBox .arrow").eq(num).hasClass("rotate")){
        $(".aboutBox .arrow").eq(num).removeClass("rotate");
    }else{
        $(".aboutBox .arrow").removeClass("rotate");
        $(".aboutBox .arrow").eq(num).addClass("rotate");
    }
    selectNum = num;
    var obj = project;
    var imgArr = obj.contentImages.split(";");
    var reportArr = obj.businessDataImage.split(";");
    var imgArr3 = obj.teamIntro.split(";");
    var html = '';
    var html2 = '';
    var html3 = '';
    reportArr = reportArr.reverse();
    if(num == 0){
        for(var i = 0;i < imgArr.length;i++){
          if(imgArr[i].indexOf("mp4") > -1 || imgArr[i].indexOf("html") > -1){
            
            html += '<video width="648" height="364.25" controls>';
            html += '  <source src="'+ imgArr[i] +'" type="">';
            html += '  您的浏览器不支持 HTML5 video 标签。';
            html += '</video>';

          }else{
            html += '<img src="'+ imgArr[i] +'">';
          }
        }
        $(".aboutBox .contentImages").html(html);

    }else if(num == 1){

        for(var i = 0;i < reportArr.length;i++){
            if(i < 12){
                var msg = reportArr[i].split("?");
                html2 += '<div class="item flex">';
                html2 += '    <div class="text">'+ unescape(msg[1]) +'</div>';
                // 'msg[0]'
                // html2 += '    <div class="action">点击打开</div>';
                html2 += '    <a href="'+ msg[0] +'"><div class="action">点击打开</div></a>';


                html2 += '</div>';
            }

        }
        // if(reportArr.length > 1){
        //     html2 += '<div class="item flex">';
        //     html2 += '    <div class="action" style="padding:0;">>>点击查看更多</div>';
        //     html2 += '</div>';
        // }
        $(".aboutBox .dataTable").html(html2);
    }else{
        for(var i = 0;i < imgArr3.length;i++){
            html3 = '<img class="imgs" src="'+ imgArr3[i] +'">';
        }
        $("#teamIntro").html(html3);
    }


}

function listProjects(page) {

    $.ajax({
        type: 'get',
        url: '/api//listProjects.do',
        data: {
            page: page,
            size: 10
        },
        // headers: {
        //     'Authorization': "BASIC " + getCookie("token")
        // },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object.content;
                if (!obj) {
                    return
                }
                Do_not_trigger = true;
                var html = '';
                $.each(obj, function(i, n) {


                    html += '<a class="itemBox" href="projectDetail.html?id='+ n.id +'">';
                    html += '    <img class="imgs" src="'+ n.logo +'">';
                    html += '    <div class="itemContent">';
                    html += '        <div class="title">'+ n.name +'</div>';
                    html += '        <div class="tips">'+ n.addr +'</div>';
                    html += '        <div class="content">'+ n.description +'</div>';
                    html += '    </div>';
                    html += '</a>';

                })
                if(page == 0){
                    $(".list").html(html);
                }else{
                    $(".list").append(html);
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function getProject() {
    if(!getURLPara("id")){
        showMsg("数据错误")
        return
    }
    $.ajax({
        type: 'get',
        url: '/api/getProject.do',
        data: {
            projectId: getURLPara("id")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                var obj = data.object;
                if (!obj) {
                    return
                }
                project = obj;
                $(".itemBox .imgs").html('<img src="'+ obj.logo +'" alt="">');
                $(".itemContent .title").html(obj.name);
                $(".itemContent .tips").html(obj.addr);
                $(".itemContent .content").html(obj.description);

                $(".appointmentSummary .item .num").eq(0).html(obj.fullAmount);
                $(".appointmentSummary .item .num").eq(1).html(obj.sellAmount);
                $(".appointmentSummary .item .num").eq(2).html(obj.unitAmount);
                
                if(obj.stat == "OPEN"){
                    stat = true;
                    $(".footer").show();
                }

                var progressNum = Number(obj.sellAmount / obj.fullAmount * 100).toFixed(2);
                $(".progressBox .progressNum").html(progressNum);
                $(".progressBox .progress").css({left:(progressNum-100)+"%"});
                $(".aboutBox .introduction").html(obj.introduction);
                selecTab(selectNum);
                
            } else {
                alert(data.message)
            }
        }
    });
}
function buyProjectShareShow(){
    //payPopUp.submited.pay_number * detail.unitAmount
    if(!getCookie("token")){
        showMsg("请登录再购买")
        return
    }
    totalNum = (project.fullAmount - project.sellAmount) / project.unitAmount;
    $("#buyShow").show();
    $(".shopName").html(project.name);
    $(".unitAmount").html(project.unitAmount);
    $(".share").html(totalNum);
    $(".myMoney").html(userFund.amount);
    $(".needMoney").html(share * project.unitAmount);
    $("#needShare").val(share);
}
function buyProjectShare(){
    
    var money = $(".needMoney").html();
    var moneyTag = getCapitalizedAmount(money);
    var content = '你确定要花费 ￥' + money + ' 购买餐厅' + project.name + '的份额吗';
    
    $("#buyMsgShow .title").html("购买确认");
    $("#buyMsgShow .msgTips").html(content);
    $("#buyMsgShow .moneyTag").html(moneyTag);

    $("#buyMsgShow").show();
}

function buyShopGo(){
    share = selectShareNum;
    $.ajax({
        type: 'post',
        url: '/api//buyProjectShare.do',
        data: {
            projectId:project.id,
            shareAmount:share
        },
        headers: {
            'Authorization': "BASIC " + getCookie("token")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                showMsg("购买成功");
                $('#buyMsgShow').hide();
                $('#buyShow').hide();
                getProject();
                getCustomersFund(function(data){
                    userFund = data;
                })
            } else {
                alert(data.message)
            }
        }
    });
}

function minusCount(){
    var num = selectShareNum - 1;
    if(num > 0){
        $("#needShare").val(num);
        selectShareNum = num;
        $(".shop-number-right-plus").removeClass("disable-btn");
    }else{
        return
    }
    if(num == 1){
        $(".shop-number-right-reduce").addClass("disable-btn");
    }else{
        $(".shop-number-right-reduce").removeClass("disable-btn");
    }
    $(".needMoney").html(selectShareNum * project.unitAmount);
    

}
function addCount(){
    var num = selectShareNum + 1;
    if(num <= totalNum){
        $("#needShare").val(num);
        selectShareNum = num;
        $(".shop-number-right-reduce").removeClass("disable-btn");
    }else{
        return
    }
    if(num == totalNum){
        $(".shop-number-right-plus").addClass("disable-btn");
    }else{
        $(".shop-number-right-plus").removeClass("disable-btn");
    }
    $(".needMoney").html(selectShareNum * project.unitAmount);
}
// getVideoInfo();
// function getVideoInfo() {
//     $.ajax({
//         type: 'get',
//         url: 'http://vv.video.qq.com/getinfo',
//         data: {
//             vids: 'x0164ytbgov',
//             otype: 'json',
//         },
//         dataType: 'json',
//         success: function(data) {
//             if (data.success) {

//                 var obj = data.object;
//                 if (!obj) {
//                     return
//                 }
//                 $(".itemBox .imgs").html('<img src="'+ obj.logo +'" alt="">');
//                 $(".itemContent .title").html(obj.name);
//                 $(".itemContent .tips").html(obj.addr);
//                 $(".itemContent .content").html(obj.description);

//                 $(".appointmentSummary .item .num").eq(0).html(obj.fullAmount);
//                 $(".appointmentSummary .item .num").eq(1).html(obj.sellAmount);
//                 $(".appointmentSummary .item .num").eq(2).html(obj.unitAmount);
                
//                 if(obj.stat == "OPEN"){
//                     stat = true;
//                 }

//                 var progressNum = Number(obj.sellAmount / obj.fullAmount * 100).toFixed(2);
//                 $(".progressBox .progressNum").html(progressNum);
//                 $(".progressBox .progress").css({left:(progressNum-100)+"%"});

 

//             } else {
//                 alert(data.message)
//             }
//         }
//     });
// }