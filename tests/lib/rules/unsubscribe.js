/**
 * @fileoverview unsubscribe the events which are subscribed
 * @author peter
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/unsubscribe"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("unsubscribe", rule, {
  valid: [
    {
      code: `
      var Hello = createReactClass({
        subscribe: function(event) {return event},
        unsubscribe: function(event) {return event},
        componentDidMount: function() {
          this.subscribe('weather')
        },
        componentWillUnmount: function(event) {
          this.unsubscribe('weather')
        }
      });
    `,
    },
    {
      code: `
      var PubSub = {subscribe: function(event){}, unsubscribe: function(event){}};
      var Hello = createReactClass({
        subscribe: function(event) {},
        unsubscribe: function(event) {},
        componentDidMount: function() {
          this.subscribe('weather1');
          PubSub.subscribe('weather2');
        },
        componentWillUnmount: function(event) {
          this.unsubscribe('weather1');
          PubSub.unsubscribe('weather2');
        }
      });
    `,
    },
  ],

  invalid: [
    {
      code: `
        var PubSub = {subscribe: function(event){}, unsubscribe: function(event){}};
        var Hello = createReactClass({
          subscribe: function(event) {},
          on: function(event) {},
          addEventListener: function(event) {},
          addListener: function(event) {},
          addListeners: function() {},
          componentDidMount: function() {
            this.subscribe('weather1');
            this.on('weather2');
            this.addEventListener('weather3');
            this.addListeners();
            PubSub.subscribe('weather4')
          }
        });
      `,
      errors: [{
        message: 'Must unsubscribe weather1 in componentWillUnmount'
      }, {
        message: 'Must off weather2 in componentWillUnmount'
      }, {
        message: 'Must removeEventListener weather3 in componentWillUnmount'
      }, {
        message: 'Must removeListeners in componentWillUnmount'
      }, {
        message: 'Must PubSub.unsubscribe weather4 in componentWillUnmount'
      }]
    }
  ],
});
