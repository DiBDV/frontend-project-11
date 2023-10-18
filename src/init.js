// @ts-nocheck
// @ts-ignore
import Example from './Example.js';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next'
import resources from './resources/index.js';
import axios from 'axios';

const validate = (value, urls) => {
  const schema = yup.string().url().required().notOneOf(urls);
  return schema.validate(value)
}

const getRssFeed = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      return response.data.contents;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    })
}

const parseRssLink = (xmlString) => {
  const xmlDocument = new DOMParser().parseFromString(xmlString, "text/xml");
  const xmlItems = xmlDocument.querySelectorAll("item");
  console.log("xmlDocument", xmlDocument);

  const feedTitle = xmlDocument.querySelector("title").textContent;
  const description = xmlDocument.querySelector("description").textContent;

  console.log("feedTitle", feedTitle);
  console.log("description", description);


  const items = [];
  for (const item of xmlItems) {
    const title = item.querySelector("title").textContent;
    console.log("title", title);
    const link = item.querySelector("link").textContent;
    console.log("link", link);
    const description = item.querySelector("description").textContent;
    console.log("description", description);
    items.push({title, link, description})
  };

  return {
    feedTitle, description,
    items,
  }
}

export default () => {
  const elements = {
    searchBar: document.getElementById('url-input'),
    buttonAdd: document.getElementsByClassName('btn-primary'),
    feedback: document.getElementsByClassName('feedback'),
    searchbarPlaceholder: document.getElementById('url-input'),
    linkExample: document.getElementsByClassName('mt-2'),
    posts: document.querySelector('.posts'),
    feeds: document.getElementsByClassName('feeds'),
  }

  const intitalState = {
    language: 'ru',
    form: {
      url: '',
      state: 'filling',
      error: '',
    },
    urls: [],
    posts: {
      title: '',
      link: ''
    },
    feeds: {
      title: '',
      description: ''
    },
    modal: {
      title: '',
      content: ''
    }
  };

  i18n
    .init({
      lng: intitalState.language,
      fallbackLng: 'en',
      debug: false,
      resources
    }).then(() => {
      yup.setLocale({
        string: {
          url: i18n.t('errors.invalidUrl')
        },
      })
    })

  // Model
  // @ts-ignore
  const state = onChange(intitalState, (path, value, previousValue) => {
    console.log('stateChange', path, value, JSON.stringify(state));
    if (path === 'form.state') {
      renderError(state);
    }
    if (path === 'feeds') {
      renderFeeds(state); // 
    }
    if (path === 'posts') {
      renderPosts(state);
    }
    renderPosts(state);
  })

  // View
  const renderError = (state) => {
    elements.feedback[0].innerHTML = i18n.t(state.form.error);
    elements.searchBar?.classList.add('border-danger');
  };
  
  const renderPosts = (state) => {
    const fragment = new DocumentFragment();
    const postsContainer = document.createElement('div');
    const postsHeader = document.createElement('h2');
    postsContainer.innerText = i18n.t('postsHeader');
    postsContainer.appendChild(postsHeader);
    elements.posts.innerHTML = '';
    elements.posts.appendChild(postsContainer);
  }

  // Controller
  elements.searchBar?.addEventListener('input', (e) => {
    e.preventDefault();

    state.form.error = '';
    state.form.state = 'filling';
    // @ts-ignore
    const urlValue = e.target?.value;

    validate(urlValue, state.urls)
      .then(() => {
        state.urls.push(urlValue);
        state.form.url = urlValue;
        state.form.state = 'valid';

        getRssFeed(urlValue)
          .then(parseRssLink)
          .then((data) => {
            console.log("data", data)
            state.feeds.push({ title: data.title, url: urlValue })
            state.posts.push(data.items)
          })
          .catch((e) => {
            state.form.error = e.message;
            state.form.state = 'error'
          })

      })
      .catch((e) => {
        state.form.error = e.message;
        state.form.state = 'error';
      })

  

    // parseRssLink(urlValue)
    //   .then(() => {
    //     state.posts.push(urlValue);
    //   })
  })
};


/*
? why error not generated immediately once I start typing
- on submit or input
- test links for rss 
   https://lorem-rss.hexlet.app/feed?unit=second&interval=30
   http://rss.cnn.com/rss/cnn_topstories.rss
   https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml
   https://rss.nytimes.com/services/xml/rss/nyt/Science.xml
   https://lifehacker.com/rss

- 
*/