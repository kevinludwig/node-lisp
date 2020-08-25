const peek = (s) => s.length ? s[0] : null; 
const take = (s) => s.substring(1);

const ws = (ch) => {
    switch (ch) {
        case ' ':
        case '\n':
        case '\f':
        case '\t':
        case '\r':
        return true;
        default:
        return false;
    }
};

const read_token = (s) => {
    let ch = peek(s);
    
    /* eat ws */
    while (ws(peek(s))) s = take(s);

    /* parens are tokens */
    ch = peek(s);
    if (ch === '(' || ch === ')') {
        return {
            text: take(s),
            token: ch
        }
    }

    /* eat double quoted string */
    if (ch === '"') {
        let res = '';
        do {
            ch = peek(s);
            res += ch;
            s = take(s);
        } while (peek(s) !== '"');
        res += peek(s);
        s = take(s);
        return {
            text: s,
            token: res
        };
    }

    /* eat until whitespace or parens */
    let res = ch;
    s = take(s);
    while (!ws(peek(s)) && peek(s) !== '(' && peek(s) !== ')') {
        res += peek(s);
        s = take(s);
    }
    return {
        text: s,
        token: res
    };
}

const tokenize = (text) => {
    const res = [];
    while (text.length) {
        let r = read_token(text);
        res.push(r.token);
        text = r.text;
    }
    return res;
};
module.exports = tokenize;
