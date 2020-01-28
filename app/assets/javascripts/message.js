$(function(){ 
   var reloadMessages = function() {
    last_message_id = $('.chat__main__message-list__container:last').data("message-id");
    group_id = $('.chat__main__message-list').data("group-id");

    $.ajax({
      url: `/groups/${group_id}/api/messages`,
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.log(messages)
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat__main__message-list').append(insertHTML);
        $('.chat__main__message-list').animate({ scrollTop: $('.chat__main__message-list')[0].scrollHeight});
        $("#new_message")[0].reset();
        $(".form__submit").prop("disabled", false);
      }
    })
    .fail(function() {
      console.log('error');
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }

  function buildHTML(message){
      if ( message.content && message.image ) {
        var html =
        `<div class="chat__main__message-list__container" data-message-id=${message.id}>
          <div class="chat__main__message-list__top" >
            <div class="upper-message">
              <div class="chat__main__message-list__top_name">
                ${message.user_name}
              </div>
              <div class="chat__main__message-list__top_daytime">
                ${message.created_at}
              </div>
            </div>
            <div class="chat__main__message-list__bottom">
              <p class="chat__main__message-list__bottom__content">
                ${message.content}
              </p>
            </div>
            <img src=${message.image} >
          </div>`
        return html;
      } else if (message.content) {
        var html =
        `<div class="chat__main__message-list__container" data-message-id=${message.id}>
          <div class="chat__main__message-list__top" >
            <div class="upper-message">
              <div class="chat__main__message-list__top_name">
                ${message.user_name}
              </div>
              <div class="chat__main__message-list__top_daytime">
                ${message.created_at}
              </div>
            </div>
            <div class="chat__main__message-list__bottom">
              <p class="chat__main__message-list__bottom__content">
                ${message.content}
              </p>
            </div>
          </div>`
        return html;
      } else if (message.image) {
        var html =
        `<div class="chat__main__message-list__container" data-message-id=${message.id}>  
          <div class="chat__main__message-list__top" >
            <div class="upper-message">
              <div class="chat__main__message-list__top_name">
                ${message.user_name}
              </div>
              <div class="chat__main__message-list__top_daytime">
                ${message.created_at}
              </div>
            </div>
            <div class="chat__main__message-list__bottom">
              <p class="chat__main__message-list__bottom__content">
                ${message.image}
              </p>
            </div>
          </div>`
        return html;  
      }
  };
$('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      console.log(html)
      $('.chat__main__message-list').append(html);
      $('form')[0].reset();
      $('.chat__main__message-list').animate({ scrollTop: $('.chat__main__message-list')[0].scrollHeight});
      $('.chat__main__message-form__container__send').removeAttr('disabled',false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
})
});

