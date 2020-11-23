

var page = 0;
var Do_not_trigger = true ; //是否触发加载
$(function() {
    listProjects(page);
    var range = 40; // 距下边界长度/单位px
    var totalheight = 0;
    $(document).scroll(function() {
        var srollPos = $(document).scrollTop(); // 
        var single_con_sh = $('body')[0].scrollHeight; // 内容高度
        var single_content = $('.wrap').height();// 内容高度
        // console.log(single_content,srollPos,single_con_sh,single_con_sh - single_content - srollPos);
        totalheight = parseFloat(single_con_sh) - parseFloat(single_content) - parseFloat(srollPos);
        console.log(srollPos,single_con_sh,single_content,totalheight)
        if (range >= totalheight) {
            if (Do_not_trigger) {
                Do_not_trigger = false;
                page++;
                listProjects(page)
            }
        }
    });
})

function listProjects(page) {

    $.ajax({
        type: 'get',
        url: '/api//listProjects.do',
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
