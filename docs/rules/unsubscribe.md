# 强制在componentWillUnmount方法中移除指定事件的监听器

检测在componentDidMount中添加了指定的时间监听器，而没有在componentWillUnmount中移除，从而导致监听器重复监听导致的问题


## Rule Details

Examples of **incorrect** code for this rule:

```js

class Test extends React.Component {
  on() {
    ...
  }
  off() {
    ...
  }

  componentDidMount() {
    this.on();
    this.on();
    this.on();
  }

  componentWillUnmount() {
    this.off();
  }

  render() {
    return null;
  }
}

```

Examples of **correct** code for this rule:

```js

class Test extends React.Component {
  on() {
    ...
  }
  off() {
    ...
  }

  componentDidMount() {
    this.on();
    this.on();
    this.on();
  }

  componentWillUnmount() {
    this.off();
    this.off();
    this.off();
  }

  render() {
    return null;
  }
}

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## TODO

加入事件名称检测