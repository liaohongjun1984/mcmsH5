
var page = 0;
var Do_not_trigger = true ; //是否触发加载
$(function() {
    getTopBar();
    getListArticle(page);
    var range = 40; // 距下边界长度/单位px
    var totalheight = 0;
    $(document).scroll(function() {
        var single_content = $('body').height();
        var srollPos = $(document).scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)
        var single_con_sh = $('body')[0].scrollHeight; // div的实际内容高度
        // console.log(single_content,srollPos,single_con_sh,single_con_sh - single_content - srollPos);
        totalheight = parseFloat(single_con_sh) - parseFloat(single_content) - parseFloat(srollPos);
        console.log(srollPos,single_con_sh,totalheight,range)
        if (range >= totalheight) {
            if (Do_not_trigger) {
                Do_not_trigger = false;
                page++;
                getListArticle(page)
            }
        }
    });
})


function getListArticle(page) {

    $.ajax({
        type: 'get',
        url: '/api/listArticle.do',
        data: {
            category: 'Article',
            page: page,
            size: 5
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

                    var imgArr = n.images.split(";").slice(0, 2);
                    var classify = n.classify ? String(n.classify).split(";") : '';
                    html += '<li>';
                    html += '    <a href="article.html?id='+ n.id +'">';
                    html += '        <img src="'+ imgArr[0] +'" alt="">';
                    html += '        <div class="shopDetail">';
                    html += '            <h3>'+ n.subject +'</h3>';
                    html += '            <p>'+ n.subTitle +'</p>';
                    html += '            <div class="clear">';
                    for (var x = 0; x < classify.length; x++) {
                        if(x % 2== 1){
                            html += '<div class="btn1 fr">'+ classify[x] +'</div>';
                        }else{
                            html += '<div class="btn2 fr">'+ classify[x] +'</div>';
                        }
                    }

                    html += '            </div>';
                    html += '        </div>';
                    html += '    </a>';
                    html += '</li>';
                })
                if(page == 0){
                    $(".shopList").html(html);
                }else{
                    $(".shopList").append(html);
                }
            } else {
                alert(data.message)
            }
        }
    });
}

function getTopBar() {

    $.ajax({
        type: 'get',
        url: '/api/topBar.do',
        data: {
            code: 'INDEX_TOP'
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                var obj = data.object.images;
                if (!obj) {
                    return
                }
                var imgArr = obj.split(";");
                var html = '';
                $.each(imgArr,function(i,n){
                    html += '<img class="swiper-slide" src="'+ n +'" alt="">';
                    html += '<img class="swiper-slide" src="'+ n +'" alt="">';
                    html += '<img class="swiper-slide" src="'+ n +'" alt="">';
                })
                $(".banner .swiper-wrapper").html(html);
                $(function(){

                    var mySwiper = new Swiper('.banner', {
                        autoplay: true,//可选选项，自动滑动
                        // 如果需要分页器
                        // pagination: '.swiper-pagination',
                        pagination: '.swiper-pagination',
                        paginationClickable: true
                    })
                })

            } else {
                alert(data.message)
            }
        }
    });
}