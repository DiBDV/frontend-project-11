# Tests and linter status

[![Actions Status](https://github.com/DiBDV/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/DiBDV/frontend-project-11/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/97f6af44a0680256a902/maintainability)](https://codeclimate.com/github/DiBDV/frontend-project-11/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/97f6af44a0680256a902/test_coverage)](https://codeclimate.com/github/DiBDV/frontend-project-11/test_coverage)

## webpack-package

[![github action status](https://github.com/hexlet-boilerplates/webpack-package/workflows/Node%20CI/badge.svg)](https://github.com/hexlet-boilerplates/webpack-package/actions)
[![Code Climate](https://codeclimate.com/github/hexlet-boilerplates/webpack-package/badges/gpa.svg)](https://codeclimate.com/github/hexlet-boilerplates/webpack-package)

## Setup

```sh
make install
```

## Run

```sh
make develop
```


## known bugs/limitations

For the case you're facing the issue, that bootstrap is throwing the error about [art-sass peprectation](https://github.com/twbs/bootstrap/issues/39028). Please user the following [workaround](https://github.com/twbs/bootstrap/pull/39030/files#diff-41667d8b9901aa9fa52483b538bb9026c287f2c663d2fdc01acffa06888cc087). The file is located in {your_project_folder/node_modules/bootstrap/scss/mixins/_grid.scss}.

```js
@mixin row-cols($count) {
  > * {
    flex: 0 0 auto;
    width: divide(100%, $count);
    width: percentage(divide(1, $count));
  }
}
```
