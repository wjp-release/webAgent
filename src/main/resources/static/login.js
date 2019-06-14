var validator;
var basePath;
var Login = function () {
    var handleLogin = function () {
            validator = $('#form_login').validate({
                rules: {
                    username: {
                        required: true,
                        // minlength: 2,
                        // maxlength: 8
                    },
                    password: {
                        required: true,
                        // minlength: 2,
                        // maxlength: 10
                    }
                },
                submitHandler: function (form) {
                    $.ajax({
                        type: "POST",
                        url: "/user/login",
                        data: {
                            userName: $('#username').val(),
                            pswd: $('#password').val()
                        },
                        cache: false,
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {//成功
                                setCookie("userId", data.object.userId);
                                setCookie("userName", data.object.userName);
                                setCookie("deptId", data.object.deptId);
                                setCookie("deptName", data.object.deptName);
                                document.getElementById("form_login").reset();
                                //setPage();
                                document.location.href = "/user/setPage";
                            } else {//失败
                                layer.msg('登录失败：' + data.msg, {icon: 2, offset: 't'});
                            }

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                            layer.msg('登录失败', {icon: 2, offset: 't'});
                        }

                    });
                }
            });
        }
    ;

    return {
        init: function () {
            // var storage = window.localStorage;
            // var getName = storage["name"];
            // var getPwd = storage["password"];
            // var getIsStroepwd = storage["isstorePwd"];
            //
            // if ("yes" == getIsStroepwd) {
            //     $("#loginUserId").val(getName);
            //     $("#loginPassword").val(getPwd);
            //     $("#isRemeberPwd").attr("checked", true);
            // } else {
            //     $("#isRemeberPwd").attr("checked", false);
            // }
            //
            // if (getCookie("rememberMe") === "on") {
            //     $('#username').val(getCookie("username"));
            //     $('#password').val(getCookie("password"));
            //     $("input[name='rm_user']:checked").attr("checked", "checked");
            //     $("#rm_user").prop("checked", true);
            // }

            handleLogin();
        }

    };

}
();

jQuery(document).ready(function () {

    // $.ajaxSetup({
    //     // crossDomain: true,
    //     xhrFields: {withCredentials: true}
    // });

    basePath = getBasePath();
    console.log(basePath);

    Login.init();
});

// function setPage() {
//     $.ajax({
//         type: "GET",
//         url: "/user/setPage",
//         data: {},
//         cache: false,
//         dataType: "json",
//         success: function (data) {
//         },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
//             layer.msg('页面跳转异常', {icon: 2, offset: 't'});
//         }
//     })
// }