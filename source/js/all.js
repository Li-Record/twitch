$(document).ready(function () {
  console.log('ready');
  $('.loader-inner').loaders();
  const twitchClient = {
    id: 'lqvtrh1ew90xekcjlrqoywwptaioqo',
    secret: 'u17jrynqwp9cerkzvrgk1z5xl2hxa7',
  }
  function getStreamerList(token) {
    // 取得實況列表
    $.ajax({
      type: "GET",
      async: true,
      url: "https://api.twitch.tv/helix/streams",
      data: {
        language: "zh",
      },
      headers: {
        'client-id': twitchClient.id,
        'Authorization': 'Bearer ' + token,
      },
      success: function (response) {
        const data = response.data;
        data.forEach((item) => {
          let id = item.user_id;
          item.profile_image_url = getStreamerInfo(id, token);
          // console.log(getStreamerInfo(id, token));
        })

        randerStreamerList(data);
      },
      error: function () {
        console.log('getting list error');
      }
    });
  }
  function getStreamerInfo(user_id, token) {
    // 取得實況主資訊
    let img = ''
    $.ajax({
      type: "GET",
      async: false,
      url: "https://api.twitch.tv/helix/users",
      data: {
        id: user_id,
      },
      headers: {
        'client-id': twitchClient.id,
        'Authorization': 'Bearer ' + token,
      },
      success: function (response) {
        const data = response.data;
        // console.log(data[0].profile_image_url);
        img = data[0].profile_image_url;
      },
      error: function () {
        console.log('getting info error');
      }
    });
    return img;
  }
  // 取得 token
  $.ajax({
    type: "POST",
    async: true,
    url: "https://id.twitch.tv/oauth2/token",
    data: {
      client_id: twitchClient.id,
      client_secret: twitchClient.secret,
      grant_type: 'client_credentials',
    },
    success: function (response) {
      const access_token = response.access_token;

      getStreamerList(access_token);
    },
    error: function () {
      console.log('token error');
    }
  });
  function randerStreamerList(streamerList) {
    let list = streamerList;
    let listElment = '';
    console.log(list);
    list.forEach((item) => {
      let name = item.user_name;
      let title = item.title;
      let thumbnail = item.thumbnail_url.replace('{width}x{height}', '300x180');
      let userImg = item.profile_image_url;
      let el = `
      <li class="c-streamerCard__item">
        <a class="c-streamerCard__link" href="#">
          <div class="c-streamerCard__img">
            <img src=${thumbnail || 'https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg'} alt="">
          </div>
          <div class="c-streamerCard__user">
            <img src=${userImg || 'https://pic.pimg.tw/chi771027/1208169140.jpg'} alt="">
          </div>
          <div class="c-streamerCard__info">
            <h3 class="c-streamerCard__title" title="${title}">${title}</h3>
            <p class="c-streamerCard__title" title="${name}">${name}</p>
          </div>
        </a>
      </li>
      `;
      listElment += el;
    })
    $('.h-loader').remove();
    $('#liveMasterList').html(listElment);
  }
});