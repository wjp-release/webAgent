var navigatorName = "Microsoft Internet Explorer";
var isIE = (navigator.appName === navigatorName);
var pdfExt = new Array(".pdf");//文件后缀名
var user;
$(function () {

    user = {
        'id': getCookie('userId'),
        'name': getCookie('userName'),
        'dpId': getCookie("deptId"),
        'dpName': getCookie("deptName")
    };

    if (isUserIdExit() && user.id !== '') {
        $('#user_info').html(user.dpName + '：' + user.name + '用户，您好！');
    }
    ;


    $('#modal_modify_psw').on('hidden.bs.modal', function () {
        if (isIE) {    // 此处判断是否是IE
            $('#new_psw').replaceWith($('#new_psw').clone(true));
            $('#confirm_psw').replaceWith($('#confirm_psw').clone(true));
        } else {
            $('input').val('');
        }
    });
});

function modifyPsw() {
    if ($('#new_psw').val().length < 1) {
        layer.msg('新密码不能为空', {icon: 0, offset: 't'});
    } else if ($('#confirm_psw').val().length < 1) {
        layer.msg('请确认新密码', {icon: 0, offset: 't'});
    } else if ($('#confirm_psw').val() !== $('#new_psw').val()) {
        layer.msg('两次输入密码不一致，请重新输入', {icon: 0, offset: 't'});
    } else {
        var options = {
            type: "POST",
            url: "/user/modifyPsw",
            cache: true,
            dateType: 'json',
            data: {},
            success: function (data) {
                if (data.success) {//成功
                    $('#modal_modify_psw').modal('hide');
                    layer.msg('修改密码成功', {icon: 1, offset: 't'});
                } else {//失败
                    layer.msg('修改密码失败：' + data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg('修改密码失败' + data.msg, {icon: 2, offset: 't'});
            }
        };
        $('#form_modify_psw').ajaxSubmit(options);
    }


}

function logout() {
    $.ajax({
        type: "get",
        url: "/user/logout",
        // cache: false,
        data: {},
        dateType: '',
        success: function () {
            toLogin()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
        }
    });

}

function toLogin() {
    delCookie('userId');
    delCookie('userName');
    delCookie('deptId');
    delCookie('deptName');
    document.location.href = "login.html";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

String.prototype.extension = function () {
    var ext = null;
    var name = this.toLowerCase();
    var i = name.lastIndexOf(".");
    if (i > -1) {
        var ext = name.substring(i);
    }
    return ext;
};
//判断Array中是否包含某个值
Array.prototype.contain = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj)
            return true;
    }
    return false;
};

function typeMatch(type, filename) {
    var ext = filename.extension();
    return type.contain(ext)
}

function isUserIdExit() {
    if (getCookie("userId") == null) {
        return false;
    }
    return true;
}


function getBasePath() {
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/ems
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //获取项目的basePath   http://localhost:8080/ems/
    var basePath = localhostPath + projectName + "/";
    return basePath;
}

function closeWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    } else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}


function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function forgetPsw() {
    layer.msg('请联系：', {icon: 0, offset: 't'});
}