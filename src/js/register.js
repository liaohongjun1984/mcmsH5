var reqId ='';
var telNumber ='';
function getDateRandom() {
    
    var n = 10000, m = 99999
    return Date.now() + parseInt(Math.random() * (n - m + 1) + m);
}
$(document).ready(function(){
    reqId = getDateRandom();

    // http://127.0.0.1:9000/api/imgcode.jpg?reqId=16055221987253
    // var url = location.host + "/api/imgcode.jpg?reqId=" + reqId;
    // console.log(url)
    // $(".imgCode").attr("src",location.origin + "/api/imgcode.jpg?reqId=" + reqId)
    

    $('#getCode').on('click', getCode);
    $('.imgCode').attr("src", "/api/imgcode.jpg?reqId=" + reqId);
    $('.imgCode').click(function() {
        reqId = getDateRandom();
        $('.imgCode').attr("src", "/api/imgcode.jpg?reqId=" + reqId);
    });
    // if(getCookie("identity")){
    //     $("#aId").val(getCookie("identity"));
    // }
})
function getCode() {
    telNumber = $('#telNumber').val();
    var img_code = $('#imgCode').val();
    if(telNumber == '') {
        showMsg("请输入手机号")
        return;
    }
    if(telNumber.length != 11) {
        showMsg("手机号码错误")
        return;
    }
    $('#getCode').off('click');
    var opt = {
        countTime: 60,
        getContent: "获取验证码",
        reGetContent: "重新获取",
        sC: '',
        eC: '',
        obj: $('#getCode'),
        callback: getCode
    };
    $.ajax({
        type: 'get',
        url: '/api/codes.do',
        dataType:"json",
        data: {
            reason: 'ANY_OP',
            telNumber: telNumber,
            imgcode: img_code,
            reqId: reqId
            // reason: 'REGISTER',
            // telNumber: telNumber,
            // imgcode:img_code,
            // reqId : reqId,
        },
        success: function (data) {
            console.log(data);
            if (data.success == false) {
                alert(data.message);
                $('#getCode').text("获取验证码");
                $('#getCode').on('click', getCode);
                return;
            }
            // $('#getCode').text(get_lan("forgetPasswordMsg4"));
            countSixty(opt);
            code = data.object;
            $('#getCode').text(data.message);
        },
        error: function (data) {
            //判断token是否有效
            if (data.status == 401) {
                alert(data.message);
            }
        }
    });
}
function countSixty (opt) {
    var def = {
        countTime: 60,
        getContent: '免费获取验证码',
        reGetContent: '重新发送',
        sC: '#000',
        eC: 'red',
        callback: function () {
            console.log('callback');
        }
    };
    var opt = $.extend(def, opt);
    var countdown = opt.countTime,
        getContent = opt.getContent,
        reGetContent = opt.reGetContent,
        obj = opt.obj;
    var isRun = 1;
        settime(obj);
    function settime(val) {
        if (countdown == 0) {
            val.css('color', opt.eC);
            val.removeAttr('disabled');
            val.text(getContent);
            val.on('click', opt.callback);
            if (isRun) {
                countdown = opt.countTime;
            } else {
                return;
            }
        } else {
            /*val.attr('disabled', true);*/
            val.prop('disabled', true);
            val.css('color', opt.sC);
            val.text(reGetContent + "(" + countdown + ")");
            countdown--;
            isRun = 0;
        }
        setTimeout(function() {settime(val)},1000);
    }
}


function register(){
     /*第一步：验证手机号码*/
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;// 判断手机号码的正则
    var code = $('#code').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();
    var nickName = $('#nickName').val();
    telNumber = $('#telNumber').val();
    if (telNumber.length == 0) {
      showMsg('手机号码不能为空')
      return;
    }
    if (telNumber.length < 11) {
      showMsg('手机号码长度有误！')
      return;
    }
    if (!myreg.test(telNumber)) {
      showMsg('错误的手机号码！')
      return;
    }
    if (code.length == 0) {
      showMsg('验证码不能为空')
      return;
    }
    if (password1.length == 0) {
      showMsg('密码不能为空')
      return;
    }
    if (password2.length == 0) {
        showMsg('验证密码不能为空')
        return;
      }
    if(password1 != password2){
        showMsg('密码输入不一致')
    }
    if(nickName.length == 0){
        showMsg('请输入您的昵称')
    }
    // if(document.getElementById("select") == 0){
    //     showMsg('请勾选服务协议')
    // }
    //之后还要解决是否与其他用户昵称重复问题
    $.ajax({
        type: 'post',
        url: '/api/regByTel.do',
        dataType:"json",
        data: {
            tel: telNumber,
            pwd: password1,
            code: code,
            nickName: nickName,
            aId: 275,
            thirdTag: 0
        },
        success: function (data) {
            console.log(data);
            if (data.success) {
                showMsg('注册成功，请登录');
                setTimeout(function () {
                    location.href = "user.html";
                },1500)
            }else{
                alert(data.message);
            }
        },
        error: function (data) {
            //判断token是否有效
            if (data.status == 401) {
                alert(data.message);
            }
        }
    });


}