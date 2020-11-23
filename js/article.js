

$(function() {
    getArticle();
})



function getArticle() {

    $.ajax({
        type: 'get',
        url: '/api/getArticle.do',
        data: {
            id: getURLPara("id")
        },
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                var obj = data.object;
                if (!obj) {
                    return
                }
                var imgArr = obj.contentImages.split(";");
                var contents = obj.content.split(" ");
                $("#title").html(obj.subject);
                $("#time").html(new Date(obj.createDate).Format('yyyy-MM-dd hh:mm:ss'));
                $(".articleBox h3").html(obj.subTitle);

                $.each(contents,function(i,n){
                    $(".articleBox").append('<p class="p">'+ n +'</p>')
                })
                $.each(imgArr,function(i,n){
                    $(".articleBox").append('<img class="imgs" src="'+ n +'" alt="">')
                })
// uthor: 366
// category: "Article"
// classify: "新店开张;全场8折"
// content: "置身于寺佑新马路的繁华里，集经典与创新于一身，为客人提供味蕾和精神上的双重愉悦。"
// contentImages: "https://mcms-1251625178.cos.ap-guangzhou.myqcloud.com/content1.jpg;https://mcms-1251625178.cos.ap-guangzhou.myqcloud.com/content1.jpg"
// createDate: 1589128206000
// id: 211
// images: "https://mcms-1251625178.cos.ap-guangzhou.myqcloud.com/article_summary_1.png;"
// stat: "NORMAL"
// subCategory: "nav_01"
// subTitle: "寺佑新马路店新店开张，全场8折"
// subject: "江南第一家，寺佑新马路店新店开张"

//                 articleBox
                // data.subject
                // var imgArr = obj.split(";");
                // var html = '';
                // $.each(imgArr,function(i,n){
                //     html += '<img src="'+ n +'" alt="">';
                // })
                // $(".banner").append(html);

            } else {
                alert(data.message)
            }
        }
    });
}