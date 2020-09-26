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

Add `xupea` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "xupea"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "xupea/rule-name": 2
    }
}
```

## Supported Rules

* [xupea/unsubscribe](docs/rules/unsubscribe.md): 强制在componentWillUnmount方法中移除指定事件的监听器





