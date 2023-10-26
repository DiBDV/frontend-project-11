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
      // console.log("response.data.contents", response.data.contents)
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

  const items = [];

  for (const item of xmlItems) {
    const title = item.querySelector("title").textContent;
    // console.log("title", title);
    const link = item.querySelector("link").textContent;
    // console.log("link", link);
    const description = item.querySelector("description").textContent;
    // console.log("description", description);
    items.push({ title, link, description })
  };

  const feedTitle = xmlDocument.querySelector("title").textContent;
  // console.log("feedTitel", feedTitle);
  const feedDescription = xmlDocument.querySelector("description").textContent;
  // console.log("feedDescription", feedDescription);

  return {
    feedTitle, feedDescription,
    items,
  }
}

export default () => {
  const elements = {
    searchBar: document.getElementById('url-input'),
    buttonAdd: document.querySelector('.btn-add'),
    errorMessage: document.querySelector('.feedback'),
    searchbarPlaceholder: document.getElementById('input'),
    linkExample: document.getElementById('example').innerText,
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  }

  const intitalState = {
    language: 'ru',
    form: {
      url: '',
      state: 'filling',
      error: '',
    },
    urls: [],
    posts: [],
    feeds: {
      titel: '',
      description: '',
    },
    modal: {
      title: '',
      content: ''
    }
  };

  // console.log("state.feeds.titel", state.feeds.titel );
  // console.log("state.feeds.description",state.feeds.description );

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
    // console.log('stateChange', path, value, JSON.stringify(state));
    if (path === 'form.state') {
      renderError(state);
    }
    if (path === 'feeds') {
      renderFeeds(state);
      // console.log("State", JSON.stringify(state.feeds));
    }
    if (path === 'posts') {
      renderPosts(state);
      // console.log("State", JSON.stringify(state.posts));
    }
  })

  // View
  const renderError = (state) => {
    elements.errorMessage.innerText = i18n.t(state.form.error);
    elements.searchBar?.classList.add('border-danger');
  };

  const renderPosts = (state) => {
    const postsContainer = document.createElement('div');
    postsContainer.className = 'card border-0';
    const postsContainerBody = document.createElement('div');
    postsContainerBody.className = 'card-body';
    const postsHeader = document.createElement('h2');
    postsHeader.className = 'card-title h4';
    postsHeader.innerText = i18n.t('postsHeader');
    postsContainerBody.appendChild(postsHeader);
    elements.posts.innerHTML = '';
    elements.posts.appendChild(postsContainerBody);

    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group border-0 rounded-0';

    const listItemData = state.posts;

    listItemData.forEach((itemData, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

      const listItemLink = document.createElement('a');
      listItemLink.href = itemData.url;
      listItemLink.className = index % 2 === 0 ? 'fw-normal link-secondary' : 'fw-bold';
      listItemLink.textContent = itemData.title;
      listItemLink.target = '_blank';
      listItemLink.rel = 'noopener noreferrer';

      const listItemButton = document.createElement('button');
      listItemButton.type = 'button';
      listItemButton.className = 'btn btn-outline-primary btn-sm';
      listItemButton.textContent = i18n.t('postsPreview');

      listItem.appendChild(listItemLink);
      listItem.appendChild(listItemButton);
      listGroup.appendChild(listItem);
    });

    postsContainer.appendChild(postsContainerBody);
    postsContainer.appendChild(listGroup);
    elements.posts.appendChild(postsContainer);
  }

  const renderFeeds = (state) => {
    const feedsFragment = new DocumentFragment();
    const feedsContainer = document.createElement('div');
    feedsContainer.className = 'card border-0';
    const feedsContainerBody = document.createElement('div');
    feedsContainerBody.className = 'card-body';
    const feedsHeader = document.createElement('h2');
    feedsHeader.className = 'card-title h4';
    feedsHeader.innerHTML = i18n.t('feedsHeader');
    feedsContainerBody.appendChild(feedsHeader);
    feedsFragment.appendChild(feedsContainer);
    elements.feeds.innerHTML = '';
    elements.feeds.appendChild(feedsContainerBody);

    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group border-0 rounded-0';

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item border-0 border-end-0';
    const listItemTitle = document.createElement('h3');
    listItemTitle.className = 'h6 m-0';
    listItemTitle.textContent = state.feeds.feedTitle;
    const listItemDescription = document.createElement('p');
    listItemDescription.className = 'm-0 small text-black-50';
    listItemDescription.textContent = state.feeds.feedDescription;

    listItem.appendChild(listItemTitle);
    listItem.appendChild(listItemDescription);
    listGroup.appendChild(listItem);
    feedsContainer.appendChild(feedsContainerBody);
    feedsContainer.appendChild(listGroup);
    elements.feeds.appendChild(feedsContainer);
  }

  // Controller
  elements.searchBar?.addEventListener('input', (e) => {
    e.preventDefault();

    state.form.error = '';
    state.form.state = 'filling';
    // @ts-ignore
    const urlValue = e.target?.value.trim();

    validate(urlValue, state.urls)
      .then(() => {
        state.urls.push(urlValue);
        state.form.url = urlValue;
        state.form.state = 'valid';

        getRssFeed(urlValue)
          .then(parseRssLink)
          .then((data) => {
            // console.log("data", data)
            console.log('data.FeedTitle', data.feedTitle);
            console.log('data.feedDescription', data.feedDescription);

            state.feeds.titel.push(...data.feedTitle);
            state.feeds.description.push(...data.feedDescription);
            state.posts.push(...data.items);
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