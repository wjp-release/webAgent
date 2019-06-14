var selectFile, selectComment;

jQuery(document).ready(function () {

    var oTable = new TableInit();
    oTable.Init();

});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#table_user').bootstrapTable({
            url: '/user/getAll',         //请求后台的URL（*）
            method: 'GET',                      //请求方式（*）
            toolbar: '#toolbar_file',                //工具按钮用哪个容器
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 15,                       //每页的记录行数（*）
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            // strictSearch: true,
            showColumns: false,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            /* height: 700,  */                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
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
                    field: 'userId',
                    title: '用户ID',
                    visible: false
                }, {
                    field: 'userName',
                    title: '用户名'
                },
                {
                    field: 'deptName',
                    title: '所属单位'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: function (value, row, index) {
                        return '<button id="btn_reset" type="button" class="btn btn-warning btn-xs" >重置密码</button>';
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
                }else{
                    layer.msg('用户列表加载失败：'+res.msg, {icon: 2, offset: 't'});
                }
                return data.rows;
            },
            /*行点击*/
            onClickRow: function (row, $element) {
                $('.info').removeClass('info');
                $($element).addClass('info');

            },
            onLoadSuccess: function (data) {
            },
            onLoadError: function (data) {
                layer.msg('用户列表加载失败', {icon: 2, offset: 't'});
                //     toLogin();
            }
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,
        };
        return temp;
    };

    return oTableInit;
};

window.operateEvents = {
    'click #btn_reset': function (e, value, row, index) {
        $.ajax({
            type: "get",
            url: "/user/reset",
            cache: true,
            data: {
                "changeUserId": row.userId
            },
            dateType: 'json',
            success: function (data) {
                if (data.success) {//成功
                    layer.msg('重置密码成功', {icon: 1, offset: 't'});

                } else {//失败
                    layer.msg('重置密码失败：' + data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg('重置密码失败', {icon: 2, offset: 't'});
            }
        });
        return false;
    },

}



