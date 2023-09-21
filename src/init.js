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
  axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      console.log("rssResponce", response);
    })
    .catch((error) => {
      console.log(error);
    })
}

const parseRssLink = (value) => {
  const parser = new DOMParser();
  const parsedFeed = parser.parseFromString(value, "text/html");
  console.log("parsedFeed", parsedFeed);
  return parsedFeed;
}

export default () => {
  const elements = {
    searchBar: document.getElementById('url-input'),
    buttonAdd: document.getElementsByClassName('btn-primary'),
    feedback: document.getElementsByClassName('feedback'),
    searchbarPlaceholder: document.getElementById('url-input'),
    linkExample: document.getElementsByClassName('mt-2'),
    posts: document.getElementsByClassName('posts'),
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
      // render Error
    }
  })


  // View
  const renderError = (state) => {
    elements.feedback[0].innerHTML = i18n.t(state.form.error);
    elements.searchBar?.classList.add('border-danger');
  };


  const renderPage = (state) => {
    // elements.buttonAdd[0].innerHTML = i18n.t('add')
    const postsContainer = document.createElement('div');
    const postsHeader = document.createElement('h2');
    postsContainer.innerText = i18n.t('postsHeader')
    posts.appendChild(postsContainer);
    postsContainer.appendChild(postsHeader);
  }

  // Controller
  elements.searchBar?.addEventListener('submit', (e) => {
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
      })
      .catch((e) => {
        state.form.error = e.message;
        state.form.state = 'error';
      })

    getRssFeed(urlValue, state.feeds)
      .then(() => {
        state.feeds.push(urlValue);
      })
      .catch((e) => {
        state.form.error = e.message;
        state.form.state = 'error'
      })

    parseRssLink(urlValue)
      .then(() => {
        state.posts.push(urlValue);
      })
    
    renderPage(urlValue);

    // state.form.url = urlValue;
    // const urlSchema = yup.string().url(urlValue);
    // const urlDuplicate = yup.string().notOneOf(state.urls);

    //   const validateUrl = (url) => {
    //     return /** @type {Promise<void>} */(new Promise((resolve, reject) => {
    //       urlDuplicate.isValid(url)
    //         .then(valid => {
    //           if (valid) {
    //             resolve();
    //           } else {
    //             reject(new Error('URL already present'));
    //             state.form.error = i18n.t('errors.duplicateUrl');
    //           }
    //         })
    //         .catch(error => {
    //           reject(error);
    //         })
    //       urlSchema.isValid(url)
    //         .then(valid => {
    //           if (valid) {
    //             resolve();
    //           } else {
    //             reject(new Error('Invalid URL'));
    //             state.form.error = i18n.t('errors.invalidUrl');
    //           }
    //         })
    //         .catch(error => {
    //           reject(error);
    //         });

    //     }));
    //   };

    //   validateUrl(urlValue)
    //     .then(() => {
    //       state.form.state = 'valid';
    //       // @ts-ignore
    //       state.urls.push(urlValue);
    //       console.log('URL is valid', urlValue);
    //     })
    //     .catch(error => {
    //       state.form.state = 'error'
    //       console.log(error.message);
    //     })



  })
};


/*
? why error not generated immediately once I start typing
- on submit
- test links for rss 
   https://lorem-rss.hexlet.app/feed?unit=second&interval=30
   http://rss.cnn.com/rss/cnn_topstories.rss
   https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml
   https://rss.nytimes.com/services/xml/rss/nyt/Science.xml
   https://lifehacker.com/rss

- 
*/