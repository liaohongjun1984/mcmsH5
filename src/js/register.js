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
        countTime: 120,
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
    var password = $('#password').val();
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
    if (password.length == 0) {
      showMsg('密码不能为空')
      return;
    }
    $.ajax({
        type: 'put',
        url: '/api/regByTel.do',
        dataType:"json",
        data: {
            telNumber: telNumber,
            newPassword: password,
            code: code
        },
        success: function (data) {
            console.log(data);
            if (data.success) {
                showMsg('修改成功，请重新登录！');
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