/**
 * @fileoverview unsubscribe the events which are subscribed
 * @author Peter Xu
 */
"use strict";

const allSubsAndUnsubs = {
  on: "off", // EventEmitter
  subscribe: "unsubscribe", // PubSub.js
  addEventListener: "removeEventListener", // EventTarget
  addListener: "removeListener", // EventEmitter
  addListeners: "removeListeners", // Custom
  off: "on",
  unsubscribe: "subscribe",
  removeEventListener: "addEventListener",
  removeListener: "addListener",
  removeListeners: "addListeners"
};

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

function isComponentDidMount(name) {
  return name === "componentDidMount";
}

function isComponentWillUnmount(name) {
  return name === "componentWillUnmount";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "强制在componentWillUnmount方法中移除指定事件的监听器",
      category: "最佳实践",
      recommended: false,
    },
    fixable: "code",
    schema: [{
      enum: ['disallow-in-func']
    }],
  },

  create: function (context) {
    // variables should be defined here
    const mode = context.options[0] || "allow-in-func";

    const map = new Map();

    let hasComponentDidMount = false;
    let hasComponentWillUnmount = false;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function nameMatches(name) {
      return ["componentDidMount", "componentWillUnmount"].indexOf(name) > -1
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          callee.type !== "MemberExpression" ||
          !allSubsAndUnsubs[callee.property.name]
        ) {
          return;
        }

        const ancestors = context.getAncestors(callee).reverse();

        let depth = 0;

        ancestors.some((ancestor) => {
          if (/Function(Expression|Declaration)$/.test(ancestor.type)) {
            depth++;
          }

          if (
            (ancestor.type !== "Property" &&
              ancestor.type !== "MethodDefinition" &&
              ancestor.type !== "ClassProperty") ||
            !nameMatches(ancestor.key.name) ||
            (mode !== "disallow-in-func" && depth > 1)
          ) {
            return false;
          }
          if (isComponentDidMount(ancestor.key.name)) {
            hasComponentDidMount = true;

            const subName = callee.property.name;
            const subs = map.get(subName) || [];

            const nodeWrapper = {
              originNode: callee,
              firstArgument: node.arguments[0] ? node.arguments[0].value : '',
              name: callee.property.name
            }

            subs.push(nodeWrapper);
            map.set(subName, subs);
          }

          if (isComponentWillUnmount(ancestor.key.name)) {
            hasComponentWillUnmount = true;


            const unsubName = callee.property.name;
            const ubsubs = map.get(unsubName) || [];

            const nodeWrapper = {
              originNode: callee,
              firstArgument: node.arguments[0] ? node.arguments[0].value : '',
              name: callee.property.name
            }

            ubsubs.push(nodeWrapper);
            map.set(unsubName, ubsubs);
          }
        });
      },

      "Program:exit"() {
        if (!hasComponentDidMount) return;

        Object.keys(allSubsAndUnsubs).forEach(function (sub) {
          const allSubs = map.get(sub) || [];
          const allUnsubs = map.get(allSubsAndUnsubs[sub]) || [];

          if (allSubs.length > 0) {
            for (let i = 0; i < allSubs.length; i++) {
              const { originNode, firstArgument, name } = allSubs[i];

              if (allUnsubs.some(unsub => unsub.name === allSubsAndUnsubs[name] && unsub.firstArgument === firstArgument)) {
                continue;
              }

              let unsubscribePrefix = '';;
              if (originNode.object.type === 'Identifier') {
                unsubscribePrefix = originNode.object.name + '.'
              }

              context.report({
                node: originNode,
                message: `Must ${unsubscribePrefix + allSubsAndUnsubs[name]} ${firstArgument} in componentWillUnmount`,
              });
            }
          }
        });
      },
    };
  },
};
