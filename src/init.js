// @ts-check

import Example from './Example.js';

import onChange from 'on-change';

export default () => {
  const elements = {
    searchBar: document.getElementsByClassName('form-floating'),
    buttonAdd: document.getElementsByClassName('btn-primary'),
  }

  const intitalState = {
    form: {
      url: '',
      state: 'filling',
    },
  };

  const state = onChange(intitalState, () => {

  });

  console.log('El', elements)
  // const obj = new Example(element);
  // obj.init();
};
