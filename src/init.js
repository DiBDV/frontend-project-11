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
      const url = state.form.url = e.target?.value;
      // @TODO Validate

      const schema = yup.string().url(url);
      console.log('schema', schema);

      const isValidUrl = (schema) => {
        if (schema.StringSchema = false) {
          state.form.state = 'error'
          console.error(schema);
        } state.form.state = 'valid'
      }

      console.log('urlValidation', isValidUrl);

  })
};
