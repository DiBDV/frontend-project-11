# Automatic tests

After completing all the steps in the project, automatic tests will become available to you. Tests are run on each commit - once all tasks in the Hexlet interface are completed, make a commit, and the tests will run automatically.

The hexlet-check.yml file is responsible for running these tests - do not delete this file, edit it, or rename the repository.

# webpack-package

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

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://hexlet.io?utm_source=github&utm_medium=link&utm_campaign=webpack-package)

This repository is created and maintained by the team and the community of Hexlet, an educational project. [Read more about Hexlet](https://hexlet.io?utm_source=github&utm_medium=link&utm_campaign=webpack-package).

See most active contributors on [hexlet-friends](https://friends.hexlet.io/).

# known bugs/limitations

For the case you're facing the issue, that bootstrap is throwing the error about [art-sass peprectation](https://github.com/twbs/bootstrap/issues/39028). Please user the following [workaround](https://github.com/twbs/bootstrap/pull/39030/files#diff-41667d8b9901aa9fa52483b538bb9026c287f2c663d2fdc01acffa06888cc087). The file is located in {your_project_folder/node_modules/bootstrap/scss/mixins/_grid.scss}.

```
@mixin row-cols($count) {
  > * {
    flex: 0 0 auto;
    width: divide(100%, $count);
    width: percentage(divide(1, $count));
  }
}
```