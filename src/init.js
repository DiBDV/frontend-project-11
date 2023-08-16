// @ts-check

import Example from './Example.js';

import onChange from 'on-change';

export default () => {
  const element = document.getElementsByClassName('form-floating');

  const intitalState = {
    form: {
      url: '',
      state: 'filling',
    },
  };

  const state = onChange(intitalState, () => {

  });
  console.log('El', element)
  // const obj = new Example(element);
  // obj.init();
};
