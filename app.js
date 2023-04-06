// const DEFAULT_CORS_PROXY = url => `https://cors.zserge.com/?u=${encodeURIComponent(url)}`;
const DEFAULT_CORS_PROXY = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const DEFAULT_FEEDS = [
  'https://news.google.com/rss',
];

const MAX_NEWS_PER_FEED = 500;
const MAX_NEWS_ON_PAGE = 1000;

const loading = document.querySelector('#loading');
const menu = document.querySelector('#menu');
const title = document.querySelector('#title');
const settings = document.querySelector('#settings');
const keywords = document.querySelector('#settings input');
const news = document.querySelector('#news');
const newsFeeds = document.querySelector('#feeds');

const feedItem = document.querySelector('#settings-feed-item');
const newsItem = document.querySelector('#news-item');

// State = {lastSeen: Date, feeds: Array<Feed>}
// Feed = {url: String, Entries: Array<Entry>}
// Entry = {title: String, link: String, timestamp: Date}
const state = (() => {
  try {
    // Restore from local storage
    let state = JSON.parse(localStorage.getItem('state-v1'));
    // Parse timestamps from JSON
    state.feeds.forEach(feed => {
      feed.entries.forEach(e => {
        e.timestamp = new Date(e.timestamp);
      });
    });
    return state;
  } catch (e) {
    // Try importing settings from the URL
    try {
      const settings = JSON.parse(atob(window.location.hash.substring(1)));
      return {
        feeds: settings.feeds.map(url => ({url, entries: []})),
        keywords: settings.keywords,
      };
    } catch (e) {
      // If anything goes wrong - use default values
      return {
        feeds: DEFAULT_FEEDS.map(url => ({url, entries: []})),
        keywords: '',
      };
    }
  }
})();

function save() {
  localStorage.setItem('state-v1', JSON.stringify(state));
  const settings = {
    feeds: state.feeds.map(f => f.url),
    keywords: state.keywords,
  };
  window.location.hash = btoa(JSON.stringify(settings));
}

let urlFilter = '';

// parseFeed converts RSS or Atom text into a list of feed entries
function parseFeed(text) {
  const xml = new DOMParser().parseFromString(text, 'text/xml');
  const map = (c, f) => Array.prototype.slice.call(c, 0).map(f);
  const tag = (item, name) =>
    (item.getElementsByTagName(name)[0] || {}).textContent;
  switch (xml.documentElement.nodeName) {
    case 'rss':
      return map(xml.documentElement.getElementsByTagName('item'), item => ({
        link: tag(item, 'link'),
        title: tag(item, 'title'),
        timestamp: new Date(tag(item, 'pubDate')),
      }));
    case 'feed':
      return map(xml.documentElement.getElementsByTagName('entry'), item => ({
        link: map(item.getElementsByTagName('link'), link => {
          const rel = link.getAttribute('rel');
          if (!rel || rel === 'alternate') {
            return link.getAttribute('href');
          }
        })[0],
        title: tag(item, 'title'),
        timestamp: new Date(tag(item, 'updated')),
      }));
  }
  return [];
}

const simplifyLink = link => link.replace(/^.*:\/\/(www\.)?/, '');

// RENDER SETTINGS MENU
function renderSettings() {
  keywords.value = state.keywords;
  newsFeeds.innerHTML = '';
  state.feeds.forEach(f => {
    const el = document.importNode(feedItem.content, true).querySelector('li');
    el.querySelector('span').innerText = simplifyLink(f.url);
    // Click View button
    el.querySelector('span').onclick = () => {
      urlFilter = f.url;
      menu.classList.remove('close');
      menu.classList.add('back');
      settings.classList.remove('shown');
      title.innerText = simplifyLink(f.url);
      render(urlFilter);
      window.scrollTo(0,0);
    };

    removeArray = [];
    function checkRemove(item) {
      return(item == f.url);
    }
    // Click Remove button
    el.querySelectorAll('a')[0].onclick = (e) => {
      if (e.currentTarget.innerText == "x ") {
        // if x button
        e.currentTarget.nextElementSibling.classList.add('toremove');
        state.feeds = state.feeds.filter(x => x.url !== f.url);
        if (removeArray.some(checkRemove)) {
          null
        } else {
          removeArray.push(f.url);
        }
        e.currentTarget.innerText = "< "
      } else if (e.currentTarget.innerText == "< ") {
        // if < button
        e.currentTarget.nextElementSibling.classList.remove('toremove');
        if (removeArray.some(checkRemove)) {
          removeArray.splice(removeArray.indexOf(f.url), 1);
        } else {
          null
        }
        e.currentTarget.innerText = "x "
      } else {
        null
      }
    };
    newsFeeds.appendChild(el);
    // BEGIN SORT ALPHA
    function sortList(ul) {
    var feedslist = document.getElementById(ul);
    Array.from(feedslist.getElementsByTagName("LI"))
      .sort((a, b) => a.textContent.localeCompare(b.textContent))
      .forEach(li => feedslist.appendChild(li));
    }
    sortList("feeds");
    // END SORT ALPHA
  });
}

// RENDER FEED SETTINGS
function render(urlFilter = '') {
  const marks = state.keywords.replace(" ,", ",").replace(", ", ",").split(/[,]|[ ]{2,}/).map(k => k.trim()).filter(k => k.length).map(k => {
    let mode = '';
    if (k[0] == "/" && k[k.length - 1] == '/') {
      k = k.substring(1, k.length - 1);
    } else {
      k = '\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b';
      mode = (k.toLowerCase() == k ? 'i' : '');
    }
    return new RegExp(k, mode);
  });
  const highlight = s => marks.some(m => m.exec(s));
  const newsList = [].concat(...state.feeds.filter(f => !urlFilter || f.url == urlFilter).map(f => f.entries))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_NEWS_ON_PAGE);

  news.innerHTML = '';
  newsList.forEach((n, i) => {
    // Get or create a new item
    let el = news.childNodes[i];
    if (!el) {
      el = document.importNode(newsItem.content, true).querySelector('li');
      news.appendChild(el);
    }

    // If the day has changed between the two adjacent items - show new date delimiter
    const day = i ? newsList[i - 1].timestamp.toDateString() : '';
    if (n.timestamp.toDateString() !== day) {
      // Insert date in h3
      el.querySelector('h3').innerText = n.timestamp.toLocaleDateString('cs-CZ');
    } else {
      el.querySelector('h3').innerText = '';
    }

    // NEWS ITEM RENDER
    // Link
    el.querySelector('a').href = n.link;
    // Headline
    el.querySelector('span').innerHTML = n.title;
    // Render higlight colour y/n
    if (highlight(n.title)) {
      el.querySelector('span').classList.add('marked');
    } else {
      el.querySelector('span').classList.remove('marked');
    }
    // Source attrib
    el.querySelector('em').innerText = `\n${simplifyLink(n.link).split('/')[0]}`;
  });
}

// Button controls
function onMenuClicked() {
  // If button state is "X"
  if (menu.classList.contains('close')) {
    title.innerText = '';
    menu.classList.remove('close');
    settings.classList.remove('shown');
    // If button state is "back"
  } else if (menu.classList.contains('back')) {
    title.innerText = '';
    urlFilter = '';
    menu.classList.remove('back');
    menu.classList.add('close');
    settings.classList.add('shown');
    render(urlFilter);
    // Otherwise...
  } else {
    title.innerText = '';
    menu.classList.add('close');
    settings.classList.add('shown');
  }
  window.scrollTo(0,0);
}

// When Done clicked
function onDoneClicked() {
  // filter state.feeds with removeArray
  // state.feeds = state.feeds.filter(x => x.url !== f.url);
  if (!Array.isArray(removeArray) || !removeArray.length) {
    null
  } else {
    const removeSet = new Set(removeArray);
    state.feeds = state.feeds.filter((item) => {
      return !removeSet.has(item);
    });
  }
  save();
  window.location.reload();
  onMenuClicked();
  render(urlFilter);
}

// When Add clicked
function onAddFeedClicked() {
  const url = prompt(`URLs`);
  url.toLowerCase().split(/\s/).forEach((url) => {
    if (url) {
      if (!state.feeds.some(f => f.url === url)) {
        state.feeds.push({url, entries: []});
      }
    }
  });
  save();
  window.scrollTo(0,0);
  window.location.reload();
}

// Close settings on "Return" key pressed
keywords.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    var text = document.querySelector('#settings input').value;
    var newText = text.replace(/[ ]{3,}/, "  ").replace(/,\s*/, ", ");
    document.querySelector('#settings input').value = newText;
    document.activeElement.blur();
    onDoneClicked();
  }
});

// When keywords field state changes
function onKeywordsChanged(keywords) {
  state.keywords = keywords;
  save();
}

(async () => {
  // Register service worker for PWA
  navigator.serviceWorker.register('sw.js');
  // Render cached news
  save();
  renderSettings();
  render(urlFilter);
  // Fetch each feed and render the settings screen
  for (const feed of state.feeds) {
    const f = parseFeed(await fetch(DEFAULT_CORS_PROXY(feed.url)).then(res => res.text()));
    feed.entries = feed.entries
      .concat(
        f.filter(e => feed.entries.findIndex(x => (x.link === e.link || x.title === e.title)) < 0),
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_NEWS_PER_FEED);
    localStorage.setItem('state-v1', JSON.stringify(state));
  }
  
  // Hide loading indicator
  loading.classList.add('hidden');
  render(urlFilter);
})();
