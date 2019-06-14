$(function () {
    // $.ajaxSetup({
    //     // crossDomain: true,
    //     xhrFields: {withCredentials: true}
    // });


    $('#modal_upload').on('show.bs.modal', function () {

    });

    $('#modal_get_deal').on('show.bs.modal', function () {

        $.ajax({
            type: "GET",
            url: "/comment/getDeal",
            data: {
                cid: selectComment.comment.cid
            },
            dateType: 'json',
            success: function (data) {
                if (data.success) {//成功

                    $('#deal_commentContext').html(data.object.commentContext);
                    $('#deal_commentContext').html(data.object.commentContext);
                    if (data.object.attachFilePath == "") {
                        $('#div_download_attach').html("<span>无附件</span>");
                    } else {
                        $('#div_download_attach').html("<a href='#' onclick='downloadAttach(&quot;" + data.object.attachFilePath + "&quot;)';>点击下载</a>");
                    }
                    if (data.object.dealAttachFilePath == "") {
                        $('#div_download_deealed').html("<span>无附件</span>");
                    } else {
                        $('#div_download_deealed').html("<a href='#' onclick='downloadAttach(&quot;" + data.object.dealAttachFilePath + "&quot;)';>点击下载</a>");
                    }

                } else {//失败
                    layer.msg(data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg('加载处理详情失败', {icon: 2, offset: 't'});

            }
        });
    });

    $('#modal_upload').on('hidden.bs.modal', function () {
        if (navigator.appName === navigatorName) {    // 此处判断是否是IE
            $('#pdf_file').replaceWith($('#pdf_file').clone(true));
            $('#pdf_title').replaceWith($('#pdf_title').clone(true));
        } else {
            $('#pdf_file').val('');
            $('#pdf_title').val('');
        }
        $("[type='checkbox']").prop("checked", false);
    });

    $('#modal_comment').on('show.bs.modal', function () {
        $('#comment_fileTitle').html(selectFile.pFile.fileTitle);
        $("#comment_fileId").val(selectFile.pFile.pid);
    });

    $('#modal_comment').on('hidden.bs.modal', function () {
        if (isIE) {    // 此处判断是否是IE
            $('#attchFile').replaceWith($('#attchFile').clone(true));
        } else {
            $('#attchFile').val('');
        }
        $("#form_submit_comment input").val("");
        $("#form_submit_comment textarea").val("");
    });

    $('#modal_deal').on('show.bs.modal', function () {
        $('#deal_fileTitle').html(selectFile.pFile.fileTitle);
        $('#deal_commentTitle').html(selectComment.comment.commentTitle);
        $('#deal_commentContext').html(selectComment.comment.commentContext);
        $('#deal_cid').val(selectComment.comment.cid);

        if (selectComment.comment.commentAttachfilePath == "") {
            $('#div_download').html("<span>无附件</span>");
        } else {
            $('#div_download').html("<a href='#' onclick='downloadAttach(&quot;" + selectComment.comment.commentAttachfilePath + "&quot;)';>点击下载</a>");
        }
    });

    $('#modal_deal').on('hidden.bs.modal', function () {
        if (isIE) {    // 此处判断是否是IE
            $('#dealContext').replaceWith($('#dealContext').clone(true));
        } else {
            $('#dealContext').val('');
        }
    });

    $('#modal_get_deal').on('show.bs.modal', function () {
        $('#dealed_fileTitle').html(selectFile.pFile.fileTitle);
        $('#dealed_commentTitle').html(selectComment.comment.commentTitle);
        $('#dealed_commentContext').html(selectComment.comment.commentContext);
        $('#dealed_dealContext').html(selectComment.comment.dealContext);
    });

    $('#modal_file_detail').on('show.bs.modal', function () {

        var url = encodeURIComponent("/s/getPdf?filePath=" + selectFile.pFile.filePath);
        $("#pdfIframe").attr("src", "../static/pdf/generic/web/viewer.html?file=" + url);
    });

})
;


function fileSelect() {
    var s = document.getElementById("pdf_title");
    var filepath = document.getElementById("pdf_file");
    s.value = filepath.value;
}

function upLoadPdfFile() {
    var fileName = $("#pdf_file").val();
    var fileTitle = $("#pdf_title").val();

    var str = '';
    $(".single:checked").each(function () {
        str += ($(this).val()) + ',';
    });

    if (fileName.length < 1) {
        layer.msg('未选择文件，请选择pdf文件', {icon: 0, offset: 't'});
    } else if (typeMatch(pdfExt, fileName)) {
        $("#fileTitle").val(fileName);
        var options = {
            type: "POST",
            url: "/s/upload",
            dataType: "json",
            data: {
                deptIds: str//values//str//arr//jsonString

            },
            success: function (data) {
                if (data.success) {
                    $('#modal_upload').modal('hide');
                    layer.msg('上传【' + fileTitle + '】成功', {icon: 1, offset: 't'});
                    $('#table_file').bootstrapTable('refresh');
                } else {
                    layer.msg('上传pdf失败：' + data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg('上传pdf失败', {icon: 2, offset: 't'});
            }
        };

        $('#form_upload_pdf').ajaxSubmit(options);
    } else {
        layer.msg('文件格式不正确，请选择pdf文件', {icon: 0, offset: 't'});
    }
};

function addComment() {

    var cTitle = $('#commentTitle').val();
    if (cTitle.length > 0) {
        var options = {
            type: "post",
            url: "/comment/addComment",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    $('#modal_comment').modal('hide');
                    layer.msg('提交意见成功', {icon: 1, offset: 't'});
                    var opt = {
                        url: "/comment/getComments?pid=" + selectFile.pFile.pid
                    };
                    $('#table_comment').bootstrapTable('refresh', opt);
                } else {
                    layer.msg("提交意见失败：" + data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg("提交意见失败", {icon: 2, offset: 't'});
            }
        };

        $('#form_submit_comment').ajaxSubmit(options);

    } else {
        layer.msg('请填写意见标题', {icon: 0, offset: 't'});
    }

}

function addDeal() {

    var cDeal = $('#dealContext').val();
    if (cDeal.length > 0) {
        var options = {
            type: "post",
            url: "/comment/addDeal",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    $('#modal_deal').modal('hide');
                    layer.msg('提交意见处理成功', {icon: 1, offset: 't'});
                    var opt = {
                        url: "/comment/getComments?pid=" + selectFile.pFile.pid
                    };
                    $('#table_comment').bootstrapTable('refresh', opt);
                } else {
                    layer.msg("提交意见处理失败：" + data.msg, {icon: 2, offset: 't'});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status + '  ' + XMLHttpRequest.readyState + ' ' + textStatus);
                layer.msg("提交意见处理失败", {icon: 2, offset: 't'});
            }
        };

        $('#form_submit_deal').ajaxSubmit(options);
    } else {
        layer.msg('请填写意见反馈', {icon: 0, offset: 't'});
    }

}

function downloadAttach(fileUrl) {


    var url = "/comment/downLoadAttachFile?fileUrl=" + encodeURI(fileUrl);

    var elemIF = document.createElement("iframe");
    elemIF.src = url;
    elemIF.style.display = "none";
    document.body.appendChild(elemIF);
}

function checkAll(a) {
    var xz = $(a).prop("checked");//判断全选按钮的选中状态
    var ck = $("[type='checkbox']").prop("checked", xz);  //让class名为qx的选项的选中状态和全选按钮的选中状态一致。
}



