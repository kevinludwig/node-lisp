#!/usr/local/bin/node

/* a sort of port from here: 
 * https://norvig.com/lispy.html
 */

const {read} = require('./reader');
const evaluate = require('./evaluate');
const readline = require('readline');
const RL = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const to_string = (s) => {
    if (Array.isArray(s)) {
        return '(' + s.map(to_string).join(' ') + ')';
    } else if (s === null) return 'null';
    else if (s === undefined) return undefined;
    else return s.toString();
};

const repl = (prompt = '> ') => {
    RL.question(prompt, (line) => {
        if (line) {
            try {
                const v = evaluate(read(line));
                console.log(to_string(v));
            } catch (ex) {
                console.log(ex);
            }
        }
        repl(prompt);
    });
};

repl();
