$(document).ready(function () {
  console.log('ready');

  // loading 套件
  $('.loader-inner').loaders();

  // twitch API id
  const twitchClient = {
    id: 'lqvtrh1ew90xekcjlrqoywwptaioqo',
    secret: 'u17jrynqwp9cerkzvrgk1z5xl2hxa7',
  }

  // API 取得 token
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

  // 實況列表
  let streamerList = [];

  // API 取得實況列表
  function getStreamerList(token) {
    $.ajax({
      type: "GET",
      async: true,
      url: "https://api.twitch.tv/helix/streams",
      data: {
        language: "zh",
        first: 50,
      },
      headers: {
        'client-id': twitchClient.id,
        'Authorization': 'Bearer ' + token,
      },
      success: function (response) {
        const data = response.data;
        streamerList = [...data];
        streamerList.forEach((item, index) => {
          let id = item.user_id;
          getStreamerInfo(id, index, token);
        })
        randerStreamerList(streamerList);
      },
      error: function () {
        console.log('getting list error');
      }
    });
  }

  // 取得實況主資訊
  function getStreamerInfo(user_id, index, token) {
    let img = ''
    $.ajax({
      type: "GET",
      async: true,
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
        streamerList[index].profile_image_url = data[0].profile_image_url;
        randerStreamerList(streamerList);
      },
      error: function () {
        console.log('getting info error');
      }
    });
  }

  // 渲染畫面
  function randerStreamerList(streamerList) {
    let list = streamerList;
    let listElment = '';
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
