// @ts-check

import Example from './Example.js';
import onChange from 'on-change';
import * as yup from 'yup';

export default () => {
  const elements = {
    searchBar: document.getElementById('url-input'),
    buttonAdd: document.getElementsByClassName('btn-primary'),
    feedback: document.getElementsByClassName('feedback'),
  }

  const intitalState = {
    form: {
      url: '',
      state: 'filling',
    },
  };
  

  // Model
  const state = onChange(intitalState, (path, value, previouValue) => {
      console.log('stateChange', path, value, JSON.stringify(state));
      if (path === 'form.state') {
        renderError(state);
          // render Error
      }
  })
 
  
  // View
  const renderError = (state) => {
    elements.feedback[0].innerHTML = 'Please use a valid RSS URL';
  };


  // Controller
  elements.searchBar?.addEventListener('input', (e) => {
      state.form.state = 'filling';
      const urlValue = e.target?.value;
      state.form.url = urlValue;
      const urlSchema = yup.string().url(urlValue);

      // @TODO Validate

      const validateUrl = (url) => {
        return new Promise((resolve, reject) => {
          urlSchema.isValid(url)
            .then(valid => {
              if (valid) {
                resolve();
              } else {
                reject(new Error('Invalid URL'));
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      };

      validateUrl(urlValue)
        .then(() => {
          state.form.state = 'valid';
          console.log('URL is valid', urlValue);
        })
        .catch(error => {
          state.form.state = 'error'
          console.log(error.message);
        })

  })
};
