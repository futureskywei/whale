$(function () {
    // JY.Dict.setSelect("selectLeaveType", "leaveType", "1");
    loadPreOrgTree();
    loadAllApprover();
});
function loadDefaultApprover() {
    JY.Ajax.doGetRequest(null, jypath + '/backstage/workflow/approver/find', "", function (data) {
        var r = data.obj;
        $("#preOrg").val(r.accountId);
        $("#preOrgName").val(r.name);
    });

}
function loadAllApprover() {
    JY.Ajax.doGetRequest(null, jypath + '/backstage/workflow/approver/findAllApprover', {"key": "claim"}, function (data) {
        if (data.res) {
            var r = data.obj;
            var accountId = "", name = "";
            for (var i = 0; i < r.length; i++) {
                accountId += r[i].accountId + ",";
                name += r[i].name + ",";
            }
            if (accountId.length > 0) accountId = accountId.substring(0, accountId.length - 1);
            if (name.length > 0) name = name.substring(0, name.length - 1);
            $("#preOrg").val(accountId);
            $("#preOrgName").val(name);
        } else {
            JY.Model.error(date.resMsg);
        }

    });

}
function submitApply() {
    if (JY.Validate.form("leaveFrom")) {
        JY.Model.confirm("确认提交申请吗?", function () {
            var ueContent = UE.getEditor('editor').getContent();
            $("#leaveFrom").find("input[name$='attach']").val(ueContent);
            JY.Ajax.doRequest("leaveFrom", jypath + '/backstage/workflow/online/claim/start', "", function (data) {
                JY.Model.info(data.resMsg);
            });
        });
    }
}

function loadPreOrgTree() {
    JY.Ajax.doRequest(null, jypath + '/backstage/org/role/getCompanyUserPreOrgTree', null, function (data) {
        //设置
        $.fn.zTree.init($("#preOrgTree"), {
            view: {dblClickExpand: false, selectedMulti: false, nameIsHTML: true},
            data: {simpleData: {enable: true}},
            callback: {onClick: clickPreOrg}
        }, data.obj);
        //设置1
        $.fn.zTree.init($("#preOrgTree1"), {
            view: {dblClickExpand: false, selectedMulti: false, nameIsHTML: true},
            data: {simpleData: {enable: true}},
            callback: {onClick: clickPreOrg}
        }, data.obj);
    });
}

function clickPreOrg(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("preOrgTree"),
        nodes = zTree.getSelectedNodes(), v = "", n = "", o = "";
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";//获取name值
        n += nodes[i].id + ",";	//获取id值
        o += nodes[i].other + ",";//获取自定义值
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    if (n.length > 0) n = n.substring(0, n.length - 1);
    if (o.length > 0) o = o.substring(0, o.length - 1);
    if (o != 'r') {
        return false;
    }
    var approveName = $("#preOrgName").val();
    var approveID = $("#preOrg").val();
    if (JY.Object.notNull(approveName)) {
        if (approveName.indexOf(v) != -1) {
            return false;
        }
        if (approveName.split(',').length >= 2) {
            return false;
        }
        approveName = approveName + "," + v;

    } else {
        approveName = v;
    }
    if (JY.Object.notNull(approveID)) {
        if (approveID.indexOf(n) != -1) {
            return false;
        }
        approveID = approveID + "," + n;
    } else {
        approveID = n;
    }
    $("#preOrgName").val(approveName);
    $("#preOrg").val(approveID);
    $("#auOrgForm input[name$='pId']").prop("value", n);
    //因为单选选择后直接关闭，如果多选请另外写关闭方法
    hidePreOrg();
}

var preisShow = false;//窗口是否显示
function showPreOrg() {
    if (preisShow) {
        hidePreOrg();
    } else {
        var obj = $("#preOrgName");
        var offpos = $("#preOrgName").position();
        $("#preOrgContent").css({left: offpos.left + "px", top: offpos.top + obj.heith + "px"}).slideDown("fast");
        preisShow = true;
    }
}

var preisShow1 = false;//窗口是否显示
function showPreOrg1() {
    if (preisShow1) {
        hidePreOrg1();
    } else {
        var obj = $("#preOrgName1");
        var offpos = $("#preOrgName1").position();
        $("#preOrgContent1").css({left: offpos.left + "px", top: offpos.top + obj.heith + "px"}).slideDown("fast");
        preisShow1 = true;
    }
}

function hidePreOrg1() {
    $("#preOrgContent1").fadeOut("fast");
    preisShow1 = false;
}

function hidePreOrg() {
    $("#preOrgContent").fadeOut("fast");
    preisShow = false;
}

function emptyPreOrg1() {
    $("#preOrg1").prop("value", "");
    $("#preOrgName1").prop("value", "");
    $("#leaveFrom input[name$='pId1']").prop("value", "0");
}

function emptyPreOrg() {
    var aid = $("#preOrg").val();
    var aName = $("#preOrgName").val();
    var length = 0;
    if (JY.Object.notNull(aid)) {
        length = aid.split(",").length;
    }
    if (length >= 2) {
        $("#preOrg").prop("value", aid.split(",")[0]);
        $("#preOrgName").prop("value", aName.split(",")[0]);
        $("#leaveFrom input[name$='pId']").prop("value", "0");
    }
}