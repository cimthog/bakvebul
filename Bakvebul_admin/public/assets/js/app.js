/*
 Template Name: Veltrix - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 Website: www.themesbrand.com
 File: Main js
 */

// const moment = require("moment");

// const { base_url } = require("../../../../constant/constant");

// const { parse } = require("path");

// Select 2 Class   
$(document).ready(function () {
    // $(".select2").select2({
    //     placeholder: "Please Select",
    //     allowClear: true,
    // });
    
    $('.datatable_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": false,
        "paging": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
})
!function ($) {
    "use strict";

    var MainApp = function () {
        this.$body = $("body"),
            this.$wrapper = $("#wrapper"),
            this.$btnFullScreen = $("#btn-fullscreen"),
            this.$leftMenuButton = $('.button-menu-mobile'),
            this.$menuItem = $('.has_sub > a')
    };

    MainApp.prototype.intSlimscrollmenu = function () {
        $('.slimscroll-menu').slimscroll({
            height: 'auto',
            position: 'right',
            size: "5px",
            color: '#9ea5ab',
            wheelStep: 5,
            touchScrollStep: 50
        });
    },
        MainApp.prototype.initSlimscroll = function () {
            $('.slimscroll').slimscroll({
                height: 'auto',
                position: 'right',
                size: "5px",
                color: '#9ea5ab',
                touchScrollStep: 50
            });
        },

        MainApp.prototype.initMetisMenu = function () {
            //metis menu
            $("#side-menu").metisMenu();
        },

        MainApp.prototype.initLeftMenuCollapse = function () {
            // Left menu collapse
            $('.button-menu-mobile').on('click', function (event) {
                event.preventDefault();
                $("body").toggleClass("enlarged");
            });
        },

        MainApp.prototype.initEnlarge = function () {
            if ($(window).width() < 1025) {
                $('body').addClass('enlarged');
            } else {
                $('body').removeClass('enlarged');
            }
        },

        MainApp.prototype.initActiveMenu = function () {
            // === following js will activate the menu in left side bar based on url ====
            $("#sidebar-menu a").each(function () {
                var pageUrl = window.location.href.split(/[?#]/)[0];
                if (this.href == pageUrl) {
                    $(this).addClass("mm-active");
                    $(this).parent().addClass("mm-active"); // add active to li of the current link
                    $(this).parent().parent().addClass("mm-show");
                    $(this).parent().parent().prev().addClass("mm-active"); // add active class to an anchor
                    $(this).parent().parent().parent().addClass("mm-active");
                    $(this).parent().parent().parent().parent().addClass("mm-show"); // add active to li of the current link
                    $(this).parent().parent().parent().parent().parent().addClass("mm-active");
                }
            });
        },

        MainApp.prototype.initComponents = function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        },

        //full screen
        MainApp.prototype.initFullScreen = function () {
            var $this = this;
            $this.$btnFullScreen.on("click", function (e) {
                e.preventDefault();

                if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            });
        },



        MainApp.prototype.init = function () {
            this.intSlimscrollmenu();
            this.initSlimscroll();
            this.initMetisMenu();
            this.initLeftMenuCollapse();
            this.initEnlarge();
            this.initActiveMenu();
            this.initComponents();
            this.initFullScreen();
            Waves.init();
        },




        //init
        $.MainApp = new MainApp, $.MainApp.Constructor = MainApp
}(window.jQuery),

    //initializing
function ($) {
        "use strict";
        $.MainApp.init();
}(window.jQuery);




function setStatus(id) {
    //    var user_id=documsent.getElementById('changeStatus').value;
    $.ajax({
        url: base_url+'changeUserStatus',
        method: "POST",
        data: { user_pub_id: id },
        success: function (data) {
            location.reload()
        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}

function setCatStatus(id) {
    //    var user_id=document.getElementById('changeStatus').value;
    $.ajax({

        url: base_url+'changeCatStatus',
        method: "POST",
        data: { id: id },
        success: function (data) {
            // window.location.href='/tables-datatable';
            //  console.log('sss');
            location.reload(true);

        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}

function setBannerStatus(id) {
    //    var user_id=documsent.getElementById('changeStatus').value;
    $.ajax({

        url: base_url+'changeBannerStatus',
        method: "POST",
        data: { id: id },
        success: function (data) {
            // window.location.href='/tables-datatable';
            //  console.log('sss');
            location.reload(true);

        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}



$('body').on('click','#currencyStatus',function(e){
    e.preventDefault();
    var id = $(this).data('pid');
    $.ajax({
        url: base_url+'changecurrencyStatus',
        method: "POST",
        data: { id: id },
        success: function (data) {
            location.reload(true);
        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
});

$('body').on('click','#packageStatus',function(e){
    e.preventDefault();
    var id = $(this).data('pid');
    $.ajax({

        url: base_url+'changePackageStatus',
        method: "POST",
        data: { id: id },
        success: function (data) {
            // window.location.href='/tables-datatable';
            //  console.log('sss');
            location.reload(true);

        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
});

function changePayoutStatus(id) {
    //    var user_id=documsent.getElementById('changeStatus').value;
    $.ajax({

        url: base_url+'changePayoutRequest',
        method: "POST",
        data: { user_pub_id: id },
        success: function (data) {
            // window.location.href='/tables-datatable';
            //  console.log('sss');
            location.reload(true);

        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}

$(document).ready(function () {
    $('.mychechk').on('change', function () {

        $('#uid').val('');
        var sThisVal = '';
        $('.mychechk').each(function () {
            if (this.checked) {
                var ll = $(this).val();


                sThisVal = sThisVal + $(this).val() + ',';
                $('#uid').val(sThisVal);

            }
        });
        if (sThisVal != '') {
            $('#send_msg').prop("disabled", false);
        } else {
            $('#send_msg').prop("disabled", true);
        }
    });
});

$(document).ready(function () {
    $('input#textfield').on('keyup', function () {
        var charCount = $(this).val().replace(/^(\s*)/g, '').length;
        $(".result").text(charCount + " ");
        $("#textfield").css({ "border-color": "#007bff" });
    });
});
$(document).ready(function () {
    $('textarea#textfield1').on('keyup', function () {
        var charCount = $(this).val().replace(/^(\s*)/g, '').length;
        $(".result1").text(charCount + " ");
        $("#textfield1").css({ "border-color": "#007bff" });
    });
});


$(function () {

    //button select all or cancel
    $("#select-all").click(function () {
        var all = $("input.select-all")[0];
        all.checked = !all.checked
        var checked = all.checked;
        $("input.select-item").each(function (index, item) {
            item.checked = checked;
        });
    });

    //button select invert
    $("#select-invert").click(function () {
        $("input.select-item").each(function (index, item) {
            item.checked = !item.checked;
        });
        checkSelected();
    });

    //button get selected info
    $("#selected").click(function () {
        var items = [];
        $("input.select-item:checked:checked").each(function (index, item) {
            items[index] = item.value;
        });
        if (items.length < 1) {
            // alert("no selected items!!!");
            swal("Warning", "Please select user to send notification", "error");
            jQuery('#msgmodal').modal('hide');
        } else {
            jQuery('#msgmodal').modal('show');
            jQuery('#type_of_com').val('sms');
        }
    });

    //column checkbox select all or cancel
    $("input.select-all").click(function () {
        var checked = this.checked;
        $("input.select-item").each(function (index, item) {
            item.checked = checked;
        });
    });

    //check selected items
    $("input.select-item").click(function () {
        var checked = this.checked;
        console.log(checked);
        checkSelected();
    });

    //check is all selected
    function checkSelected() {
        var all = $("input.select-all")[0];
        var total = $("input.select-item").length;
        var len = $("input.select-item:checked:checked").length;
        console.log("total:" + total);
        console.log("len:" + len);
        all.checked = len === total;
    }
});


jQuery(document).ready(function () {
    jQuery('#allusers').dataTable({
    });

    jQuery('#notification_table1').dataTable({
        "lengthMenu": [[10, 50, 100, -1], [10, 50, 100, "All"]],
    });

    var data =
    {
        mobile: [], msg: '', title: ''
    }
    jQuery(document).on('click', '#select_all', function () {
        if (jQuery(this).prop('checked') == true) {
            jQuery('.notification_check').each(function (index, el) {
                jQuery(this).prop('checked', true);
                var mobile = jQuery(this).parent().prev().text();
                data.mobile.push(mobile);
            });
        }
        else {
            jQuery('.notification_check').each(function (index, el) {
                jQuery(this).prop('checked', false);
                data.mobile = [];
            });
        }
    });

    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    jQuery(document).on('click', '.notification_check', function () {
        if (jQuery(this).prop('checked') == true) {
            var mobile = jQuery(this).parent().prev().text();
            data.mobile.push(mobile);
        }
        else {
            var mobile
            var mobile = jQuery(this).parent().prev().text();
            data.mobile.remove(mobile);
        }
    });

    jQuery(document).on('click', '#notify-user', function () {
        var msg = jQuery('#msgmodal textarea').val();
        data.msg = msg;

        var title = jQuery('#msgmodal input').val();
        data.title = title;

        $.ajax({
            url: base_url + 'Admin/firebase',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                s
                swal("Success", "Notification send successfully.", "success");
                swal({
                    title: "Success",
                    text: "Notification send successfully.",
                    type: "success",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true,
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = base_url + "Admin/notifaction";
                        }
                    });
                data.mobile = []; data.title = ''; data.msg = '';
            }
        })
    });
});


function supportticket(id) {
    //    var user_id=documsent.getElementById('changeStatus').value;
    $.ajax({

        url: base_url+'updatedSupport',
        method: "POST",
        data: { user_pub_id: id },
        success: function (data) {
            // window.location.href='/tables-datatable';
            //  console.log('sss');
            location.reload(true);
        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}
$(document).ready(function () {
    $(".selected").each(function (index) {
        $(this).on("click", function () {
            var boolKey = $(this).data('selected');
            var mammalKey = $(this).attr('id');
            var atten = $(this).attr('value');
            alert(mammalKey);
            alert(atten);
            setId(mammalKey, atten);
        });
    });

    $('body').on('click', '.coupon_delete', function (e) {
        e.preventDefault();
        var coupon = $(this).data('coupon');
        $.ajax({
            url: base_url+'delete_coupon',
            method: "POST",
            data: { coupon: coupon },
            success: function (data) {
                location.reload(true);
            },
            error: function (e) {
                alert(e.toSourceCode);
            }
        });
    });

    $('body').on('submit', '#coupon_form', function (e) {
        e.preventDefault();
        $.ajax({
            url: base_url+'update_coupon',
            method: "POST",
            data: $('#coupon_form').serialize(),
            success: function (data) {
                window.location.href=base_url+'coupon';
            },
            error: function (e) {
                alert(e.toSourceCode);
            }
        });
    });

    $('body').on('submit', '#Customer_add', function (e) {
        e.preventDefault();
        $.ajax({
            url: base_url+'Customer_store',
            method: "POST",
            data: $('#Customer_add').serialize(),
            success: function (data) {
                if(data.status == 'true'){
                    window.location.href=base_url+'Customer';
                } else {
                    alert(data.message);
                }
            },
            error: function (e) {
                alert(e.toSourceCode);
            }
        });
    });
});

function setCouponStatus(id,status) {
    $.ajax({
        url: base_url+'update_coupon_status',
        method: "POST",
        data: { id: id, status:status },
        success: function (data) {
            location.reload(true);
        },
        error: function (e) {
            alert(e.toSourceCode);
        }
    });
}

var status = "";
var support_pub_id = "";
function setId(x, y) {
    // alert("setId");
    status = x;
    id = y;

    $.ajax({
        url: base_url+'updatedSupport',
        method: "POST",
        data: { status: status, id: id },
        success: function (data) {
            // window.location.href='/ticket';
        }
    })
}

$(document).ready(function () {
    var page;
    var t = $('.city_table_list').on('preXhr.dt', function (e, settings, data) {
        data.page = page;
    }).DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "pagingType": "full",
        "lengthMenu": [[10, 25, 50, 100 , -1], [10, 25, 50, 100]],
        drawCallback: function(){
            $('.paginate_button.first:not(.disabled) a', this.api().table().container())          
            .on('click', function(){
                page = 'first';
                console.log(page);
            });
            $('.paginate_button.previous:not(.disabled) a', this.api().table().container())          
            .on('click', function(){
                page = 'previous';
                console.log(page);
            });
            $('.paginate_button.next:not(.disabled) a', this.api().table().container())          
            .on('click', function(){
                page = 'next';
                console.log(page);
            });
            $('.paginate_button.last:not(.disabled) a', this.api().table().container())          
            .on('click', function(){
                page = 'last';
                console.log(page);
            });       
        },
        "ajax": {
            "type": "GET",
            "url" :'/getCustomerList',
        },
        'columns':
        [
            { "data": "check","defaultContent": "", 'name': 'ID' },
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "email_id","defaultContent": "", 'name': 'email_id'},
            { "data": "mobile_no","defaultContent": "", 'name': 'mobile_no'},
            { "data": "point","defaultContent": "", 'name': 'point' },
            { "data": "status",render:function(data){
                if(data == 1)return `<button class="button">Activate</button>`
                else{return `<button class="deactiv">Deactivate</button>`}
            },},
            { 'data': {'user_pub_id':'user_pub_id',"status":"status"},
            render:function(data){
                if(data.status == 1){
                    return `<div class="dropdown">
                    <button class="dropbtn">Manage</button>
                    <div class="dropdown-content">
                        <a href="/Customer_view/${data.user_pub_id}>">View</a>
                        <a href="/Customer_edit/${data.user_pub_id}>">Edit</a>
                        <a href="/Customer" id="changeStatus"  onclick="setStatus('${data.user_pub_id}')" value="${data.user_pub_id}"  >Deactivate</a>
                    </div>
                    </div>`
                }else{
                    return `<div class="dropdown">
                    <button class="dropbtn">Manage</button>
                    <div class="dropdown-content">
                        <a href="/Customer_view/${data.user_pub_id}>">View</a>
                        <a href="/Customer_edit/${data.user_pub_id}>">Edit</a>
                        <a href="/Customer" id="changeStatus"  onclick="setStatus('${data.user_pub_id}')" value="${data.user_pub_id}"  >Active</a>
                    </div>
                    </div>`
                }
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn-default btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn-default btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn-default btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 1, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    //paging
    // $('#next').on('click', function () {
    //     t.page('next').draw('page');
    // });
    // $('#previous').on('click', function () {
    //     t.page('previous').draw('page');
    // });
});

 /** Ticket Module */
$(document).ready(function () {
    console.log(base_url)
    if($('#ticket_id').val())showTicketComments($('#ticket_id').val())
})
function showTicketComments(ticket_id){
    $.ajax({
        type: 'POST',
        url: base_url+'get_ticket_comment',
        dataType: 'json',
        data: {
            ticket_id: ticket_id,
        },
        success: function (data) {
            if(data.status == '1'){
                console.log(data);
                var ticket_comment = data.ticket_comment; 
                var user_data = data.user_data; 
                var user = [];
                var obj = {};
                obj.id = 0;
                obj.ticket_id = 0;
                obj.role = 1;
                obj.user_pub_id = user_data[0].user_pub_id;
                obj.comment = user_data[0].description;
                obj.created_at = user_data[0].created_at;
                user.push(obj)
                ticket_comment = user.concat(ticket_comment)
                $('#user_pub_id_for_ticket').val(user_data[0].user_pub_id)
                $('#divice_token_for_ticket').val(user_data[0].device_token)
                if(ticket_comment == null || ticket_comment == '' || ticket_comment == undefined || ticket_comment == []){
                }else{
                    // console.log(ticket_comment)
                    var html = '';
                    for(let i=0; i<ticket_comment.length; i++){
                        if(ticket_comment[i].role == 1)html += '<li class="clearfix">';
                        else html += '<li class="clearfix odd">';
                        html += '<div class="chat-avatar">';
                        if(ticket_comment[i].role == 1)html += '<img src="'+base_url+''+user_data[0].image+'" alt="male">';
                        html += '<span class="time">'+moment(parseFloat(ticket_comment[i].created_at)).format('DD MMM YYYY HH:MM')+'</span>';
                        html += '</div>';
                        html += '<div class="conversation-text">';
                        html += '<div class="ctext-wrap">';
                        if(ticket_comment[i].role == 1)html += '<span class="user-name">'+user_data[0].name+'</span>';
                        else html += '<span class="user-name">Admin</span>';
                        html += '<p>';
                        html += ''+ticket_comment[i].comment+'';
                        html += '</p>';
                        html += '</div>';
                        html += '</div>';
                        html += '</li>';
                    }
                    $('#showTicketComments').html(html);
                    $('.slimscroll').slimscroll({ scrollBy: '100000%' });
                }
            }else{
                swal({
                    title:'Oops!',
                    text:'Error',
                    buttons:false,
                    timer:1500
                })
            }
        }
    });
}
function sendTicketComments(ticket_id){
    var ticket_comment_text = $('#ticket_comment_text').val();
    var user_pub_id = $('#user_pub_id_for_ticket').val()
    var divice_token = $('#divice_token_for_ticket').val()
    // alert(divice_token)
    $('#btn_submit_loading').show();
    $('#submit_btn').attr('disabled',true);
    $.ajax({
        type: 'POST',
        url: base_url+'send_ticket_comment',
        dataType: 'json',
        data: {
            ticket_id: ticket_id,
            ticket_comment_text:ticket_comment_text,
            user_pub_id:user_pub_id,
            divice_token:divice_token
        },
        success: function (data) {
            console.log(data)
            if(data.status == '1'){
                $('#btn_submit_loading').hide();
                $('#submit_btn').attr('disabled',false);
                $('#ticket_comment_text').val('');
                showTicketComments(ticket_id)
            }else{
                swal({
                    title:'Oops!',
                    text:'Error',
                    buttons:false,
                    timer:1500
                })
                $('#btn_submit_loading').hide();
                $('#submit_btn').attr('disabled',false);
            }
        }
    });
}

function ticketStatusUpdate(status,ticket_id){
    if(status && ticket_id){
        $.ajax({
            type: 'POST',
            url: base_url+'ticketStatusUpdate',
            dataType: 'json',
            data: {
                ticket_id: ticket_id,
                status:status,
            },
            success: function (data) {
                console.log(data)
                if(data.status == '1'){
                    alert(data.message)
                    location.reload();
                }else{
                    alert('error')
                    // swal({
                    //     title:'Oops!',
                    //     text:'Error',
                    //     buttons:false,
                    //     timer:1500
                    // })
                }
            }
        });
    }
}

/**Notification */
function openNotificationModel(user_id){
    $('#uid').val(user_id);
    $('#msgmodal').modal('show');
}

$(document).ready(function () {
    $("#send_notification").submit(function (e) {
        e.preventDefault();
        $('#btn_submit_loading').show();
        $('#submit_btn').attr('disabled',true);
        // var formData = new FormData($("#send_notification")[0]);
        var data = $(this).closest('form').serialize();
        $.ajax({
            type: 'POST',
            url:base_url+'send-notification',
            dataType: 'json',
            data:data,
            success: function (data) {
                if (data.status == 1) {
                    location.reload();
                    // swal({
                    //     title: "Notification",
                    //     text: data.message,
                    //     icon: "success",
                    //     buttons: 'OK'
                    // }).then(function() {
                    //     location.reload()
                    // });
                } else if (data.status == 2) {
                    // swal({
                    //     title:'Oops!',
                    //     text:'Error',
                    //     icon: "error",
                    //     buttons:'OK',
                    // })
                    $('#btn_submit_loading').hide();
                    $('#submit_btn').attr('disabled',false);
                } else {
                    error_display(data.message);
                    $('#btn_submit_loading').hide();
                    $('#submit_btn').attr('disabled',false);
                }
            }
        });
    });
});

// Api key Start
$(document).ready(function () {
    $("#firebase_key_form").submit(function (e) {
        e.preventDefault();
        // var data = $(this).closest('form').serialize();
        // $.ajax({
        //     type: 'POST',
        //     url: base_url+'add_update_api_keys',
        //     dataType: 'json',
        //     data:data,
        //     success: function (data) {
        //         if (data.status == 1) {
        //             // swal({
        //             //     title: "Api Keys",
        //             //     text: data.message,
        //             //     icon: "success",
        //             //     buttons: 'OK'
        //             // }).then(function() {
        //                 location.reload();
        //             // });
        //         } else if (data.status == 2) {
        //             // swal({
        //             //     title:'Oops!',
        //             //     text:data.message,
        //             //     icon: "error",
        //             //     buttons:'OK',
        //             // })
        //         }
        //     }
        // });
    });
    $("#Mailgun_form").submit(function (e) {
        e.preventDefault();
        var data = $(this).closest('form').serialize();
        $.ajax({
            type: 'POST',
            url: base_url+'add_update_api_keys',
            dataType: 'json',
            data:data,
            success: function (data) {
                if (data.status == 1) {
                    // swal({
                    //     title: "Api Keys",
                    //     text: data.message,
                    //     icon: "success",
                    //     buttons: 'OK'
                    // }).then(function() {
                        location.reload();
                    // });
                } else if (data.status == 2) {
                    // swal({
                    //     title:'Oops!',
                    //     text:data.message,
                    //     icon: "error",
                    //     buttons:'OK',
                    // })
                } 
            }
        });
    });
});
// Api Key End

// Lanquage Start
$(document).ready(function () {
    $("#add_update_language").submit(function (e) {
        e.preventDefault();
        var data = $(this).closest('form').serialize();
        $.ajax({
            type: 'POST',
            url: base_url+'add_update_language',
            dataType: 'json',
            data:data,
            success: function (data) {
                if (data.status == 1) {
                    // swal({
                    //     title: "Api Keys",
                    //     text: data.message,
                    //     icon: "success",
                    //     buttons: 'OK'
                    // }).then(function() {
                        if($('#update_language_form_id').val())location.href='/add_language'
                        else location.reload();
                    // });
                } else if (data.status == 0) {
                    // swal({
                    //     title:'Oops!',
                    //     text:data.message,
                    //     icon: "error",
                    //     buttons:'OK',
                    // })
                } 
            }
        });
    });
});
function updateLanguageStatus(_id,status){
    $.ajax({
        type: 'POST',
        url: base_url+'update_language_status',
        dataType: 'json',
        data:{_id,status},
        success: function (data) {
            if (data.status == 1) {
                location.reload();
            }else{
            alert('Error in update');
            } 
        }
    });
}
// Lanquage End

//Job List
$(document).ready(function () {
    refreshPendingJob();
})
function refreshPendingJob(){
    var t = $('#pending_job_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/job_datatable_list',
            "data":{"status":"Pending"}
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "price","defaultContent": "", 'name': 'price'},
            { "data": "date","defaultContent": "", 'name': 'date'},
            { "data": "time","defaultContent": "", 'name': 'time'},
            { "data": "address","defaultContent": "", 'name': 'address'},
            { 'data': "status",
            render:function(data){
                if(data == 0)return '<button class="button">Pending</button>';
                if(data == 1)return '<button class="button1">Confirm</button>';
            },},
            { 'data': "job_id",
            render:function(data){
                var html = '';
                html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                html += 'Manage';
                html += '</a>';
                html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
                html += '<a class="dropdown-item" href="/job_view?job_id='+data+'"> &nbsp;View Detail</a>';
                html += '</div>';
                return html
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
}
function refreshRunningJob(){
    var t = $('#running_job_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/job_datatable_list',
            "data":{"status":"Running"}
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "price","defaultContent": "", 'name': 'price'},
            { "data": "date","defaultContent": "", 'name': 'date'},
            { "data": "time","defaultContent": "", 'name': 'time'},
            { "data": "address","defaultContent": "", 'name': 'address'},
            { 'data': "status",
            render:function(data){
                if(data == 5)return '<button class="button1">Running</button>';
            },},
            { 'data': "job_id",
            render:function(data){
                var html = '';
                html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                html += 'Manage';
                html += '</a>';
                html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
                html += '<a class="dropdown-item" href="/job_view?job_id='+data+'"> &nbsp;View Detail</a>';
                html += '</div>';
                return html
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
}
function refreshCompletJob(){
    var t = $('#completed_job_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/job_datatable_list',
            "data":{"status":"Complete"}
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "price","defaultContent": "", 'name': 'price'},
            { "data": "date","defaultContent": "", 'name': 'date'},
            { "data": "time","defaultContent": "", 'name': 'time'},
            { "data": "address","defaultContent": "", 'name': 'address'},
            { 'data': "status",
            render:function(data){
                if(data == 2)return '<button class="button1">Completed</button>';
            },},
            { 'data': "job_id",
            render:function(data){
                var html = '';
                html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                html += 'Manage';
                html += '</a>';
                html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
                html += '<a class="dropdown-item" href="/job_view?job_id='+data+'"> &nbsp;View Detail</a>';
                html += '</div>';
                return html
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
}
function refreshCancelJob(){
    var t = $('#cancel_job_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/job_datatable_list',
            "data":{"status":"Cancelled"}
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "price","defaultContent": "", 'name': 'price'},
            { "data": "date","defaultContent": "", 'name': 'date'},
            { "data": "time","defaultContent": "", 'name': 'time'},
            { "data": "address","defaultContent": "", 'name': 'address'},
            { 'data': "status",
            render:function(data){
                if(data == 3)return '<button class="button">Cancelled</button>';
            },},
            { 'data': "job_id",
            render:function(data){
                var html = '';
                html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                html += 'Manage';
                html += '</a>';
                html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
                html += '<a class="dropdown-item" href="/job_view?job_id='+data+'"> &nbsp;View Detail</a>';
                html += '</div>';
                return html
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
}

$(document).ready(function () {
    var t = $('#invoice_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/invoice_datatable_list',
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "invoice_id","defaultContent": "", 'name': 'invoice_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "net_amount","defaultContent": "", 'name': 'net_amount'},
            { 'data': "payment_type",
            render:function(data){
                if(data == 0)return '<button class="button1">Online</button>';
                if(data == 1)return '<button class="button1">Cash</button>';
                // if(data == 2)return '<button class="button1">Wallet</button>';
            },},
            { 'data': "status",
            render:function(data){
                if(data == 0)return '<button class="button">UnPaid</button>';
                if(data == 1)return '<button class="button1">Paid</button>';
            },},
            { 'data': {"job_id":"job_id","invoice_id":"invoice_id"},
            render:function(data){
                var html = '';
                html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
                html += 'Manage';
                html += '</a>';
                html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
                html += '<a class="dropdown-item" href="/invoice_view?invoice_id='+data.invoice_id+'?job_id='+data.job_id+'"> &nbsp;View Detail</a>';
                html += '</div>';
                return html
            },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
})
$(document).ready(function () {
    var user_id = $('#user_id').val();
    var t = $('#invoice_rec_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/invoice_rec_list/'+user_id+'',
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "email_id","defaultContent": "", 'name': 'email_id'},
            // { "data": "mobile_no","defaultContent": "", 'mobile_no': 'mobile_no'},
            { 'data': {"mobile_no":"mobile_no","country_code":"country_code"},
            render:function(data){
                var mb = '';
                if(data.country_code == undefined || data.country_code == '' || data.country_code == 'undefined')mb = data.mobile_no;
                else mb= data.country_code+data.mobile_no
                return mb
            },},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "invoice_id","defaultContent": "", 'name': 'invoice_id'},
            { "data": "currency_symbol","defaultContent": "", 'name': 'currency_symbol'},
            { 'data': "payment_type",
            render:function(data){
                if(data == 0)return '<button class="button1">Online</button>';
                if(data == 1)return '<button class="button1">Cash</button>';
                // if(data == 2)return '<button class="button1">Wallet</button>';
            },},
            { "data": "coupon_code","defaultContent": "", 'name': 'coupon_code'},
            { "data": "discount_type","defaultContent": "", 'name': 'discount_type'},
            { "data": "discount_amt","defaultContent": "", 'name': 'discount_amt'},
            { "data": "final_amount","defaultContent": "", 'name': 'final_amount'},
            { "data": "net_amount","defaultContent": "", 'name': 'net_amount'},
            { 'data': "status",
            render:function(data){
                if(data == 0)return '<button class="button">UnPaid</button>';
                if(data == 1)return '<button class="button1">Paid</button>';
            },},
            { 'data': "created_at",
            render:function(data){
                return moment(parseFloat(data)).format('DD MMM YYYY HH:MM')
            },},
            // { 'data': {"job_id":"job_id","invoice_id":"invoice_id"},
            // render:function(data){
            //     var html = '';
            //     html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            //     html += 'Manage';
            //     html += '</a>';
            //     html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
            //     html += '<a class="dropdown-item" href="/invoice_view?invoice_id='+data.invoice_id+'?job_id='+data.job_id+'"> &nbsp;View Detail</a>';
            //     html += '</div>';
            //     return html
            // },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
})
$(document).ready(function () {
    var user_id = $('#user_id').val();
    var t = $('#invoice_send_list').DataTable({
        "dom": "<'row'<'col-md-4 col-sm-12 col-xs-12'B><'col-md-4 col-sm-6 col-xs-12'l><'col-md-4 col-sm-6 col-xs-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        "colReoder":true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "destroy": true,
        "lengthMenu": [[10, 25, 50, 100,200], [10, 25, 50, 100,200]],
        "ajax": {
            "type": "GET",
            "url" :'/invoice_send_list/'+user_id+'',
        },
        'columns':
        [
            { "data": "","defaultContent": "", 'name': '_ID'},
            { "data": "name","defaultContent": "", 'name': 'name'},
            { "data": "email_id","defaultContent": "", 'name': 'email_id'},
            // { "data": "mobile_no","defaultContent": "", 'mobile_no': 'mobile_no'},
            { 'data': {"mobile_no":"mobile_no","country_code":"country_code"},
            render:function(data){
                var mb = '';
                if(data.country_code == undefined || data.country_code == '' || data.country_code == 'undefined')mb = data.mobile_no;
                else mb= data.country_code+data.mobile_no
                return mb
            },},
            { "data": "job_id","defaultContent": "", 'name': 'job_id'},
            { "data": "job_title","defaultContent": "", 'name': 'job_title'},
            { "data": "invoice_id","defaultContent": "", 'name': 'invoice_id'},
            { "data": "currency_symbol","defaultContent": "", 'name': 'currency_symbol'},
            { 'data': "payment_type",
            render:function(data){
                if(data == 0)return '<button class="button1">Online</button>';
                if(data == 1)return '<button class="button1">Cash</button>';
                // if(data == 2)return '<button class="button1">Wallet</button>';
            },},
            { "data": "coupon_code","defaultContent": "", 'name': 'coupon_code'},
            { "data": "discount_type","defaultContent": "", 'name': 'discount_type'},
            { "data": "discount_amt","defaultContent": "", 'name': 'discount_amt'},
            { "data": "final_amount","defaultContent": "", 'name': 'final_amount'},
            { "data": "net_amount","defaultContent": "", 'name': 'net_amount'},
            { 'data': "status",
            render:function(data){
                if(data == 0)return '<button class="button">UnPaid</button>';
                if(data == 1)return '<button class="button1">Paid</button>';
            },},
            { 'data': "created_at",
            render:function(data){
                return moment(parseFloat(data)).format('DD MMM YYYY HH:MM')
            },},
            // { 'data': {"job_id":"job_id","invoice_id":"invoice_id"},
            // render:function(data){
            //     var html = '';
            //     html += '<a class="buttonSecondery dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            //     html += 'Manage';
            //     html += '</a>';
            //     html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
            //     html += '<a class="dropdown-item" href="/invoice_view?invoice_id='+data.invoice_id+'?job_id='+data.job_id+'"> &nbsp;View Detail</a>';
            //     html += '</div>';
            //     return html
            // },},
        ],
        "buttons": [
            {
                extend: 'excel',
                className: 'btn btn-outline-dark waves-effect waves-light btn-excel'
            },
            {
                extend: 'pdf',
                className: 'btn btn-outline-dark waves-effect waves-light btn-pdf'
            },
            {
                extend: 'print',
                className: 'btn btn-outline-dark waves-effect waves-light btn-print'
            },
        ],
        "columnDefs": [
            {
                "className": "actioncell",
                "orderable": false,
                "searchable": false,
                "sortable": false,
                "targets": [0],
                "width": "5%",
            },
        ],
        "order": [ 0, 'asc' ],
    });
    t.on('draw', function () {
        t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
            function (cell, i) {
                cell.innerHTML = i + 1;
            }
        );
    });
    $('#next').on('click', function () {
        t.page('next').draw('page');
    });
    $('#previous').on('click', function () {
        t.page('previous').draw('page');
    });
})

// Bank Details Start
$(document).ready(function () {
    $("#Customer_bank_detail_add").submit(function (e) {
        e.preventDefault();
        var data = $(this).closest('form').serialize();
        $.ajax({
            type: 'POST',
            url: base_url+'add_update_bank_details',
            dataType: 'json',
            data:data,
            success: function (data) {
                if (data.status == 1) {
                    location.reload();
                }
                if (data.status == 0) {
                    
                } 
            }
        });
    });
});
// Bank Details End

// Payout start
function getUserBalance(){
    // alert($( "#currency_id option:selected" ).attr('data-amt'))
    var amt = $( "#currency_id option:selected" ).attr('data-amt');
    if(amt == '' || amt == null || amt == undefined)amt = 0;
    amt = parseFloat(amt).toFixed(2)
    var html = '';
    html += '<label for="amount" class="col-form-label">Amount</label>';
    html += '<input class="form-control" type="text" placeholder="amount" required ';
    html += 'value="'+amt+'" data-amt="'+$( "#currency_id option:selected" ).attr('data-amt')+'"';
    html += 'id="payout_amount" name="amount" oninput="calRemainingAmt()"/>';
    $('#getUserBalanceInputBox').html(html)
}
function calRemainingAmt(){
    var amount = $('#payout_amount').attr('data-amt');
    var payout_amount = $('#payout_amount').val();
    if(payout_amount == null || payout_amount == '' || payout_amount == undefined || isNaN(payout_amount))payout_amount = 0
    var remaining_amt = parseFloat(amount)-parseFloat(payout_amount);
    if(remaining_amt == null || remaining_amt == '' || remaining_amt == undefined || isNaN(remaining_amt))remaining_amt = 0
    remaining_amt = remaining_amt.toFixed(2)
    $('#payout_remaining_balance').val(remaining_amt);
}
$(document).ready(function () {
    $("#customer_payout_add").submit(function (e) {
        e.preventDefault();
            var url = "/add_payout";
            var formData = new FormData($("#customer_payout_add")[0]);
            $.ajax({
                url:url,
                method:'POST',
                dataType: 'json',
                data:formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST', // For jQuery < 1.9
                success: function (data) {
                    console.log(data)
                    if (data.status == 1) {
                        // swal({
                        //     title: "Payout",
                        //     text: data.message,
                        //     icon: "success",
                        //     buttons: 'OK'
                        // }).then(function() {
                            location.reload()
                        // });
                    } else if (data.status == 0) {
                        // swal({
                        //     title:'Oops!',
                        //     text:data.message,
                        //     buttons:'OK',
                        //     icon: "error",
                        // });
                        // $('#btn_submit_loading').hide();
                        // $('#submit_btn').attr('disabled',false);
                    }
                }
            });
    });
    
});
// Payout End

//Payment Gateway
function showAuthKeyField(){
    var html = '';
    if($('#payment_gateway_title').val() == 'Paystack'){
        $.ajax({
            type: 'POST',
            url: base_url+'get_payment_gateway',
            dataType: 'json',
            data:{title:'Paystack'},
            success: function (data) {
                var result = data.result;
                if(result == null || result == '' || result == undefined || result == []){
                    result = {}
                    result.api_key_1 = '';
                    $('#description').val('');
                    $('#currency').val([]);
                }else{
                    result = result[0];
                    $('#description').val(result.description);
                    var array = result.currency.split(',');
                    $('#currency').val(array);
                }
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_1" class="col-form-label">Auth Key</label>';
                html += '<input class="form-control" type="text" placeholder="Auth Key" required';
                html += 'id="api_key_1" name="api_key_1" value="'+result.api_key_1+'"/>';
                html += '</div>';
                $('#showApiKeysField').html(html)
            }    
        })
    }
    if($('#payment_gateway_title').val() == 'Paytab'){
        $.ajax({
            type: 'POST',
            url: base_url+'get_payment_gateway',
            dataType: 'json',
            data:{title:'Paytab'},
            success: function (data) {
                var result = data.result;
                if(result == null || result == '' || result == undefined || result == []){
                    result = {}
                    result.api_key_1 = '';
                    result.api_key_2 = '';
                    $('#description').val('');
                    $('#currency').val([]);
                }else{
                    result = result[0];
                    $('#description').val(result.description);
                    var array = result.currency.split(',');
                    $('#currency').val(array);
                }
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_1" class="col-form-label">data-secret-key</label>';
                html += '<input class="form-control" type="text" placeholder="data-secret-key" required';
                html += 'id="api_key_1" name="api_key_1" value="'+result.api_key_1+'"/>';
                html += '</div>';
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_2" class="col-form-label">data-merchant-id</label>';
                html += '<input class="form-control" type="text" placeholder="data-merchant-id" required';
                html += 'id="api_key_2" name="api_key_2" value="'+result.api_key_2+'"/>';
                html += '</div>';
                $('#showApiKeysField').html(html)
            }
        });
    }
    if($('#payment_gateway_title').val() == 'Razorpay'){
        $.ajax({
            type: 'POST',
            url: base_url+'get_payment_gateway',
            dataType: 'json',
            data:{title:'Razorpay'},
            success: function (data) {
                var result = data.result;
                if(result == null || result == '' || result == undefined || result == []){
                    result = {}
                    result.api_key_1 = '';
                    result.api_key_2 = '';
                    $('#description').val('');
                    $('#currency').val([]);
                }else{
                    result = result[0];
                    $('#description').val(result.description);
                    var array = result.currency.split(',');
                    $('#currency').val(array);
                }
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_1" class="col-form-label">key_id</label>';
                html += '<input class="form-control" type="text" placeholder="key_id" required';
                html += 'id="api_key_1" name="api_key_1" value="'+result.api_key_1+'"/>';
                html += '</div>';
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_2" class="col-form-label">key_secret</label>';
                html += '<input class="form-control" type="text" placeholder="key_secret" required';
                html += 'id="api_key_2" name="api_key_2" value="'+result.api_key_2+'"/>';
                html += '</div>';
                $('#showApiKeysField').html(html)
            }
        });
    }
    if($('#payment_gateway_title').val() == 'Paypal'){
        $.ajax({
            type: 'POST',
            url: base_url+'get_payment_gateway',
            dataType: 'json',
            data:{title:'Paypal'},
            success: function (data) {
                var result = data.result;
                if(result == null || result == '' || result == undefined || result == []){
                    result = {}
                    result.api_key_1 = '';
                    result.api_key_2 = '';
                    $('#description').val('');
                    $('#currency').val([]);
                }else{
                    result = result[0];
                    $('#description').val(result.description);
                    var array = result.currency.split(',');
                    $('#currency').val(array);
                }
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_1" class="col-form-label">client_id</label>';
                html += '<input class="form-control" type="text" placeholder="client_id" required';
                html += 'id="api_key_1" name="api_key_1" value="'+result.api_key_1+'"/>';
                html += '</div>';
                html += '<div class="form-group col-sm-4">';
                html += '<label for="api_key_2" class="col-form-label">client_secret</label>';
                html += '<input class="form-control" type="text" placeholder="client_secret" required';
                html += 'id="api_key_2" name="api_key_2" value="'+result.api_key_2+'"/>';
                html += '</div>';
                $('#showApiKeysField').html(html)
            }
        })
    }
   
}
$(document).ready(function () {
    $("#payment_gateway_add_form").submit(function (e) {
        e.preventDefault();
        var data = $(this).closest('form').serialize();
        $.ajax({
            type: 'POST',
            url: base_url+'add_update_payment_gateway',
            dataType: 'json',
            data:data,
            success: function (data) {
                if (data.status == 1) {
                    // swal({
                    //     title: "Api Keys",
                    //     text: data.message,
                    //     icon: "success",
                    //     buttons: 'OK'
                    // }).then(function() {
                        if($('#update_language_form_id').val())location.href='/add_language'
                        else location.reload();
                    // });
                } else if (data.status == 0) {
                    // swal({
                    //     title:'Oops!',
                    //     text:data.message,
                    //     icon: "error",
                    //     buttons:'OK',
                    // })
                } 
            }
        });
    });
});