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
        subscribe: function(event) {},
        unsubscribe: function(event) {},
        componentDidMount: function() {
          this.subscribe('weather')
        },
        componentWillUnmount: function(event) {
          this.unsubscribe('weather')
        }
      });
    `,
    },
  ],

  invalid: [
    {
      code: `
        var Hello = createReactClass({
          subscribe: function(event) {},
          on: function(event) {},
          addEventListener: function(event) {},
          addListener: function(event) {},
          addListeners: function() {},
          componentDidMount: function() {
            this.subscribe('weather');
            this.on('weather');
            this.addEventListener('weather');
            this.addListeners();
          }
        });
      `,
      errors: [{
        message: 'Must unsubscribe weather in componentWillUnmount'
      }, {
        message: 'Must off weather in componentWillUnmount'
      }, {
        message: 'Must removeEventListener weather in componentWillUnmount'
      }, {
        message: 'Must removeListeners  in componentWillUnmount'
      }]
    }
  ],
});
