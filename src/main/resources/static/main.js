var selectFile, selectComment;

jQuery(document).ready(function () {

    if (isUserIdExit() && user.id !== '') {
        $('#btn_comment').attr("disabled", "disabled");
        //1.初始化Table
        var oTable = new TableInit();
        oTable.Init();
        var oLinkedTable = new LinkedTableInit();
        oLinkedTable.Init();

        $.ajax({
            type: "GET",
            url: "/s/getLowerDepts",
            data: {},
            dateType: 'json',
            success: function (data) {
                if (data.success) {//成功
                    if (data.object.length > 0) {
                        var str = ' ';
                        if (data.object.length > 2) {
                            str += str += '<label><input type="checkbox"  id="allChecked" onclick="checkAll(this)" >全选</label>';
                        }
                        $.each(data.object, function (index, items) {
                            str += '<label><input type="checkbox" class="single"  value="' + items.deptId + '">' + items.deptName + ' </label>';
                        });
                        $('#div_dept').html(str);
                    } else {
                        $('#btn_upload').attr("disabled", "disabled");
                    }

                } else {//失败
                    //layer.msg(data.msg, {icon: 2, offset: 't'});
                    $('#btn_upload').css("display", "none");

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg('加载用户部门信息失败', {icon: 2, offset: 't'});
            }
        });

    } else {
        layer.msg("当前状态无授权", {
            icon: '2',
            offset: 't',
            time: 0,
            btn: ['登录'],
            yes: function (index) {
                toLogin();
            }

        });
    }

});


var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#table_file').bootstrapTable({
            url: '/s/query',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            // toolbar: '#toolbar_file',                //工具按钮用哪个容器
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 5,                       //每页的记录行数（*）
            // pageList: [5, 10, 15],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            /* height: 700,  */                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "pid",                     //每一行的唯一标识，一般为主键列
            showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [
                {
                    field: 'id',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'pFile.pid',
                    title: 'pid',
                    visible: false
                },
                {
                    field: 'pFile.fileTitle',
                    title: '文档标题'
                }, {
                    field: 'user.userId',
                    title: '上传人id',
                    visible: false
                }, {
                    field: 'pFile.filePath',
                    title: '文件路径',
                    visible: false
                }, {
                    field: 'user.userName',
                    title: '下发用户'
                },
                {
                    field: 'user.deptName',
                    title: '所属单位'
                },
                {
                    field: 'pFile.uploadTimeStr',
                    title: '下发时间',
                    sortable: true
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: function (value, row, index) {
                        if (row.user.userId == user.id) {
                            return [
                                '<button id="btn_file_detail" type="button" class="btn btn-green btn-xs" data-toggle="modal" data-target="#modal_file_detail">查看文档</button>',
                                '<button id="btn_delete_file" type="button" class="btn btn-warning btn-xs" >删除文件</button>'
                            ].join('');
                        } else {
                            return '<button id="btn_file_detail" type="button" class="btn btn-green btn-xs" data-toggle="modal" data-target="#modal_file_detail">查看文档</button>';
                        }
                    },
                    events: operateEvents
                },
            ],
            //data:data,
            responseHandler: function (res) {
                var data = {
                    "total": 0,
                    "rows": [],
                }
                if (res.success) {
                    data = {
                        "total": res.object.length,
                        "rows": res.object,
                    }
                }
                return data.rows;
            },
            /*行点击*/
            onClickRow: function (row, $element) {
                selectFile = row;
                /* 刷新关联表 */
                var opt = {
                    url: "/comment/getComments?pid=" + row.pFile.pid
                };
                $("#table_comment").bootstrapTable('refresh', opt);


                /* 允许提交意见 */
                $('#btn_comment').removeAttr("disabled");

                $('.info').removeClass('info');
                $($element).addClass('info');

            },
            onLoadSuccess: function (data) {
            },
            onLoadError: function (data) {
                layer.msg('文件列表加载失败', {icon: 2, offset: 't'});
                //     toLogin();
            }
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset
        };
        return temp;
    };

    return oTableInit;
};

var LinkedTableInit = function () {
    var oLinkedTableInit = new Object();
    oLinkedTableInit.Init = function () {
        $('#table_comment').bootstrapTable({
            url: '',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            // toolbar: '#toolbar_comment',                //工具按钮用哪个容器
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oLinkedTableInit.queryParams,//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 5,                       //每页的记录行数（*）
            // pageList: [5, 10, 15],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "cid",                     //每一行的唯一标识，一般为主键列
            showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [
                {
                    field: 'id',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'comment.cid',
                    title: 'cid',
                    visible: false
                },
                {
                    field: 'comment.commentTitle',
                    title: '意见标题'
                },
                {
                    field: 'comment.commentContext',
                    title: '意见内容',
                    visible: false
                },
                {
                    field: 'comment.commentAttachfilePath',
                    title: '意见关联附件',
                    visible: false
                },
                {
                    field: 'user.userName',
                    title: '提出人'
                }, {
                    field: 'user.userId',
                    title: '提出人id',
                    visible: false
                },
                {
                    field: 'user.deptName',
                    title: '提出人单位'
                },
                {
                    field: 'comment.commentTimeStr',
                    title: '提出时间',
                    sortable: true
                },
                {
                    field: 'comment.isDeal',
                    title: '处理情况',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value) {
                            return '已处理';
                        } else {
                            return '未处理'
                        }
                    }
                },
                {
                    field: 'user.userName',
                    title: '处理人',
                    formatter: function (value, row, index) {
                        if (row.comment.isDeal) {
                            return value;
                        } else {
                            return ''
                        }
                    }
                },
                {
                    field: 'comment.dealTimeStr',
                    title: '处理时间'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: function (value, row, index) {
                        var str = '';
                        if (row.comment.isDeal) {
                            str += '<button id="btn_comment_context" type="button" class="btn btn-green btn-xs" data-toggle="modal" data-target="#modal_get_deal" >查看详情</button>';
                        } else {
                            if (selectFile.user.userId == user.id) {
                                str += '<button id="btn_solve" type="button" class="btn btn-xs btn-danger" data-toggle="modal" data-target="#modal_deal">处理意见</button>'
                            }
                            if (row.user.userId == user.id) {
                                str += '<button id="btn_delete_comment" type="button" class="btn btn-warning btn-xs" >删除意见</button>';
                            }
                        }


                        return str;
                    }, //自定义方法，添加操作按钮


                    // formatter: function (value, row, index) {
                    // var str = '';
                    // if (row.comment.isDeal) {
                    // str += '<button id="btn_comment_context" type="button" class="btn btn-green btn-xs" data-toggle="modal" data-target="#modal_get_deal" >查看详情</button>';
                    // } else if (selectFile.user.userId == user.id) {
                    // str += '<button id="btn_solve" type="button" class="btn btn-green btn-xs"  data-toggle="modal" data-target="#modal_deal">处理意见</button>'
                    // }
                    // if (row.user.userId == user.id) {
                    // str += '<button id="btn_delete_comment" type="button" class="btn btn-warning btn-xs" >删除意见</button>';
                    // }
                    // return str;
                    // }, //自定义方法，添加操作按钮
                    events: operateEvents
                },
            ],
            responseHandler: function (res) {
                var data = {
                    "total": 0,
                    "rows": [],
                };
                if (res.success) {
                    data = {
                        "total": res.object.length,
                        "rows": res.object,
                    }
                }
                return data.rows;
            },
            onClickRow: function (row, $element) {
                $('#table_comment .info').removeClass('info');
                $($element).addClass('info');

                selectComment = row;
            },
            onLoadSuccess: function (data) {
            },
            onLoadError: function (data) {
                layer.msg('意见列表加载失败', {icon: 2, offset: 't'});
            },

        });
    };
    //得到查询的参数
    oLinkedTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset
        };
        return temp;
    };

    return oLinkedTableInit;
};

window.operateEvents = {
    'click #btn_delete_file': function (e, value, row, index) {
        layer.msg("是否确定删除文档？", {
            icon: '3',
            offset: 't',
            time: 0,
            btn: ['删除', '取消'],
            yes: function (index) {
                $.ajax({
                    type: "get",
                    url: "/s/delete",
                    cache: true,
                    data: {
                        "pid": row.pFile.pid
                    },
                    dateType: 'json',
                    success: function (data) {
                        if (data.success) {//成功
                            layer.msg('删除文件成功', {icon: 1, offset: 't'});
                            $('#table_file').bootstrapTable('refresh');
                          //  console.log(selectFile);
                            var opt = {
                                url: ""
                            };
                            $('#table_comment').bootstrapTable('refresh', opt);
                            $('#btn_comment').attr("disabled", "disabled");
                         //   console.log(selectFile);
                        } else {//失败
                            layer.msg('删除文件失败：' + data.msg, {icon: 2, offset: 't'});
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                        layer.msg('删除文件失败', {icon: 2, offset: 't'});
                    }
                });
            },
        });
        return false;
    },
    'click #btn_delete_comment': function (e, value, row, index) {

        layer.msg("是否确定删除意见？", {
            icon: '3',
            offset: 't',
            time: 0,
            btn: ['删除', '取消'],
            yes: function (index) {
                $.ajax({
                    type: "get",

                    url: "/comment/deleteComment",
                    cache: true,
                    dateType: 'json',
                    data: {
                        "cid": row.comment.cid
                    },
                    success: function (data) {
                        if (data.success) {//成功
                            layer.msg('删除意见成功', {icon: 1, offset: 't'});
                            var opt = {
                                url: "/comment/getComments?pid=" + selectFile.pFile.pid
                            };
                            $('#table_comment').bootstrapTable('refresh', opt);
                        } else {//失败
                            layer.msg('删除意见失败：' + data.msg, {icon: 2, offset: 't'});
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                        layer.msg('删除意见失败' + data.msg, {icon: 2, offset: 't'});
                    }
                });
            },
        });


    },
}


$(document).keydown(function (e) {
    if (e.ctrlKey == true && e.keyCode == 83) {
        return false; // 截取返回false就不会保存网页了
    }
});

