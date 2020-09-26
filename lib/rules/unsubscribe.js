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
      if (["componentDidMount", "componentWillUnmount"].indexOf(name) > -1) {
        return true;
      }

      if (
        typeof shouldCheckUnsafeCb === "function" &&
        shouldCheckUnsafeCb(context)
      ) {
        return name === `UNSAFE_${methodName}`;
      }

      return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type !== "MemberExpression" ||
          callee.object.type !== "ThisExpression" ||
          (callee.property.name !== "on" && callee.property.name !== "off")
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

            const subs = map.get(callee.property.name) || [];
            subs.push(callee);
            map.set(callee.property.name, subs);
          }
          if (isComponentWillUnmount(ancestor.key.name)) {
            hasComponentWillUnmount = true;

            const ubsubs = map.get(callee.property.name) || [];
            ubsubs.push(callee);
            map.set(callee.property.name, ubsubs);
          }
        });
      },

      "Program:exit"() {
        if (!hasComponentDidMount) return;

        Object.keys(allSubsAndUnsubs).forEach(function (sub) {
          const allSubs = map.get(sub) ? map.get(sub).length : 0;
          const allUnsubs = map.get(allSubsAndUnsubs[sub])
            ? map.get(allSubsAndUnsubs[sub]).length
            : 0;

          if (allSubs > 0 && allSubs > allUnsubs) {
            for (let i = allSubs - allUnsubs - 1; i < allSubs - 1; i++) {
              context.report({
                node: map.get(sub)[i],
                message: `Should unsubscribe this event in componentWillUnmount`,
              });
            }
          }
        });
      },
    };
  },
};
