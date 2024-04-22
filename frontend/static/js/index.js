function GameSession() {
  this.coins = 0;
  this.click_power = 1;
  this.auto_click_power = 0;
  this.next_level_price = 10;

  this.init = function () {
    getCore().then((core) => {
      this.coins = core.coins;
      this.click_power = core.click_power;
      this.auto_click_power = core.auto_click_power;
      this.next_level_price = core.next_level_price;
      render();
    });
  };
  this.add_coins = function (coins) {
    this.coins += coins;
    this.check_levelup();
    render();
  };
  this.add_power = function (power) {
    this.click_power += power;
    render();
  };
  this.add_auto_power = function (power) {
    this.auto_click_power += power;
    render();
  };
  this.check_levelup = function () {
    if (this.coins >= this.next_level_price) {
      updateCoins(this.coins).then((core) => {
        this.next_level_price = core.next_level_price;
      });
    }
  };
}

let Game = new GameSession();

function call_click() {
  const kakashiNode = document.getElementById('mainBTN');
  click_animation(kakashiNode, 50);
  const audio = document.getElementById('clickSound');
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  Game.add_coins(Game.click_power);
}

function render() {
  const coinsNode = document.getElementById('coins');
  const clickNode = document.getElementById('click_power');
  const autoClickNode = document.getElementById('auto_click_power');
  coinsNode.innerHTML = Game.coins;
  clickNode.innerHTML = Game.click_power;
  autoClickNode.innerHTML = Game.auto_click_power;
}

function click_animation(node, time_ms) {
  css_time = `.0${time_ms}s`;
  node.style.cssText = `transition: all ${css_time} linear; transform: scale(0.95);`;
  setTimeout(function () {
    node.style.cssText = `transition: all ${css_time} linear; transform: scale(1);`;
  }, time_ms);
}

function getCore() {
  return fetch('/backend/core/', {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((response) => {
      return response.core;
    })
    .catch((error) => console.log(error));
}

function updateCoins(current_coins) {
  const csrftoken = getCookie('csrftoken');
  return fetch('/backend/update_coins/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrftoken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_coins: current_coins,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((response) => {
      if (response.is_levelup) {
        get_boosts();
      }
      return response.core;
    })
    .catch((error) => console.log(error));
}

// function call_click() {
//   fetch('backend/call_click', {
//     method: 'GET',
//   })
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       return Promise.reject(response);
//     })
//     .then((data) => {
//       document.getElementById('coins').innerText = data.core.coins;
//     })
//     .catch((error) => console.log(error));
// }

function get_boosts() {
  return fetch('/backend/boosts', {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((boosts) => {
      const panel = document.querySelector('.boosts-holder');
      panel.innerHTML = '';
      boosts.forEach((boost) => {
        add_boost(panel, boost);
      });
    })
    .catch((error) => console.log(error));
}

function add_boost(parent, boost) {
  const button = document.createElement('button');
  button.setAttribute('class', `boost_${boost.type}`);
  button.setAttribute('id', `boost_${boost.id}`);
  button.setAttribute('onclick', `buy_boost(${boost.id})`);
  button.innerHTML = `
    <p>lvl: <span id="boost_level">${boost.lvl}</span></p>
    <p>+<span id="boost_power">${boost.power}</span></p>
    <p><span id="boost_price">${boost.price}</span></p>
  `;
  parent.appendChild(button);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function buy_boost(boost_id) {
  console.log(123);
  const csrftoken = getCookie('csrftoken');
  return fetch(`/backend/boost/${boost_id}/`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrftoken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coins: Game.coins,
    }),
  })
    .then((response) => {
      console.log('Первый рес');
      if (response.ok) return response.json();
      return Promise.reject(response);
    })
    .then((response) => {
      console.log('Вторй рес');
      if (response.error) {
        console.log(response.error);
        return;
      }
      const old_boost_stats = response.old_boost_stats;
      const new_boost_stats = response.new_boost_stats;

      Game.add_coins(-old_boost_stats.price);
      if (old_boost_stats.type === 1) {
        Game.add_auto_power(old_boost_stats.power);
      } else {
        Game.add_power(old_boost_stats.power);
      }
      update_boost(new_boost_stats);
    })
    .catch((err) => console.log(err));
}

function setAutoClick() {
  setInterval(function () {
    Game.add_coins(Game.auto_click_power);
  }, 1000);
}

function setAutoSave() {
  setInterval(function () {
    console.log(1);
    updateCoins(Game.coins);
  }, 10000);
}

function update_boost(boost) {
  const boost_node = document.getElementById(`boost_${boost.id}`);
  boost_node.querySelector('#boost_level').innerText = boost.lvl;
  boost_node.querySelector('#boost_power').innerText = boost.power;
  boost_node.querySelector('#boost_price').innerText = boost.price;
}

window.onload = function () {
  Game.init();
  setAutoClick();
  setAutoSave();
};
