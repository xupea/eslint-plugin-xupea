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

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
