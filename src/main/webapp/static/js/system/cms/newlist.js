$(function () {
    //下拉框
    // JY.Dict.setSelect("selectisValid", "isPublished", 2, "全部");
    // getbaseList();
    //增加回车事件
    $("#baseForm").keydown(function (e) {
        keycode = e.which || e.keyCode;
        if (keycode == 13) {
            search();
        }
    });

});

function search() {
    $("#searchBtn").trigger("click");
}

function getbaseList(init) {
    if (init == 1)$("#baseForm .pageNum").val(1);
    JY.Model.loading();
    JY.Ajax.doRequest("baseForm", jypath + '/backstage/cms/findByPage', null, function (data) {
        $("#baseTable tbody").empty();
        var obj = data.obj;
        var list = obj.list;
        var results = list.results;
        var permitBtn = obj.permitBtn;
        var pageNum = list.pageNum, pageSize = list.pageSize, totalRecord = list.totalRecord;
        var html = "";
        if (results != null && results.length > 0) {
            var leng = (pageNum - 1) * pageSize;//计算序号
            for (var i = 0; i < results.length; i++) {
                var l = results[i];
                html += "<tr>";
                html += "<td class='center'><label> <input type='checkbox' name='ids' value='" + l.id + "' class='ace' /> <span class='lbl'></span></label></td>";
                html += "<td class='center hidden-480'>" + (i + leng + 1) + "</td>";
                html += "<td class='center'>" + JY.Object.notEmpty(l.title) + "</td>";
                html += "<td class='center hidden-480' >" + JY.Object.notEmpty(l.publisher) + "</td>";
                html += "<td class='center '>" + JY.Date.Default(l.addtime) + "</td>";
                html += "<td class='center '>" + JY.Date.Default(l.uptime) + "</td>";
                // html+="<td class='center hidden-480'>"+JY.Object.notEmpty(l.pip)+"</td>";
                if(l.status==1) html+="<td class='center hidden-480'><span class='label label-sm label-success'>已发布</span></td>";
                else             html+="<td class='center hidden-480'><span class='label label-sm arrowed-in'>未发布</span></td>";
                // html+="<td class='center hidden-480'>"+JY.Date.Default(l.loginLog.loginTime)+"</td>";
                // html+="<td class='center hidden-480'>"+JY.Object.notEmpty(l.loginLog.loginIP)+"</td>";
                html += JY.Tags.setFunction(l.id, permitBtn);
                html += "</tr>";
            }
            $("#baseTable tbody").append(html);
            JY.Page.setPage("baseForm", "pageing", pageSize, pageNum, totalRecord, "getbaseList");
        } else {
            html += "<tr><td colspan='10' class='center'>没有相关数据</td></tr>";
            $("#baseTable tbody").append(html);
            $("#pageing ul").empty();//清空分页
        }

        JY.Model.loadingClose();
    });
}
function check(id) {
    cleanForm();

    JY.Ajax.doRequest(null, jypath + '/backstage/cms/find', {id: id}, function (data) {
        $("#row-fluid").hide();
        $("#writeDiv").show();
        setDetailForm(data);
        // JY.Model.widthcheck("90%","auDiv");
    });
}

function setDetailForm(data) {
    var l = data.obj;
    $("#cmstitle").text(l.title);
    // JY.Tags.isValid("auForm",(JY.Object.notNull(l.isValid)?l.isValid:"0"));
    $("#cmsaddtime").text("发布时间:" + JY.Date.Default(l.addtime));
    $("#cmspublisher").text("发布人:" + JY.Object.notEmpty(l.publisher));
    $("#cmscontent").html(JY.Object.notEmpty(l.content));
    var covers = "封面图片:<img style='max-width: 300px' src='" + jypath + JY.Object.notEmpty(l.cover) + "'/>"
    if (JY.Object.notNull(l.cover)) {
        $("#cmscover").html(covers);
    } else {
        $("#cmscover").html("封面图片:无");
    }

}

function detailClose() {
    $("#row-fluid").show();
    $("#writeDiv").hide();
}

function insertClose() {
    $("#row-fluid").show();
    $("#auDiv").hide();
}



function cleanForm() {
    $(".photo-clip-rotateLayer").html("");
    $("#file").val("");
    $('#view').html("");
    $('#view').attr("style", "");
    JY.Tags.isValid("auForm", "1");
    JY.Tags.cleanForm("auForm");

}
function setForm(data) {
    var l = data.obj;
    $("#auForm input[name$='id']").val(l.id);
    // JY.Tags.isValid("auForm",(JY.Object.notNull(l.isValid)?l.isValid:"0"));
    $("#auForm input[name$='title']").val(JY.Object.notEmpty(l.title));
    $("#auForm input[name$='content']").val(JY.Object.notEmpty(l.content));
    $("#auForm input[name$='cover']").val(JY.Object.notEmpty(l.cover));
    ue.setContent(l.content);
    $("#auForm select[name$='status']").val(JY.Object.notEmpty(l.status));//状态

    var img = '<img width="210" src="/whale' + l.cover + '">';
    $('#view').html(img);
    // 创建缩略图

}
