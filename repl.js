#!/usr/local/bin/node

/* a sort of port from here: 
 * https://norvig.com/lispy.html
 */

const lisp = require('./lisp');
const readline = require('readline');
const RL = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const to_string = (s) => {
    if (Array.isArray(s)) {
        return '(' + s.map(to_string).join(' ') + ')';
    } else return s.toString();
};

const repl = (prompt = '> ') => {
    RL.question(prompt, (line) => {
        if (line) {
            try {
                const v = lisp.eval(lisp.parse(line));
                if (v) console.log(to_string(v));
            } catch (ex) {
                console.log(ex);
            }
        }
        repl(prompt);
    });
};

repl();
