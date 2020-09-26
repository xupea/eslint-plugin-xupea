# eslint-plugin-unsubscribe

sub and unsub should be paired

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-xupea`:

```
$ npm install eslint-plugin-xupea --save-dev
```


## Usage

Add `unsubscribe` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "unsubscribe"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "unsubscribe/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





