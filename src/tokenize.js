const {
    NEWLINE,
    OPEN_PAREN,
    CLOSE_PAREN,
    SEMICOLON,
    DOUBLE_QUOTE,
    WHITESPACE,
    FORM_FEED,
    TAB,
    CARRIAGE_RETURN
} = require('./constants');

const peek = (s) => s.length ? s[0] : null; 
const take = (s) => s.substring(1);

const is_whitespace = (ch) => {
    switch (ch) {
        case WHITESPACE:
        case FORM_FEED:
        case TAB:
        case CARRIAGE_RETURN:
            return true;
        default:
            return false;
    }
};

const is_special_token = (ch) => {
    switch (ch) {
        case OPEN_PAREN:
        case CLOSE_PAREN:
        case NEWLINE:
        case SEMICOLON:
            return true;
        default:
            return false;
    }
}

const read_token = (s) => {
    let ch = peek(s);
    
    /* eat ws */
    while (is_whitespace(peek(s))) s = take(s);

    /* parens are tokens */
    ch = peek(s);
    if (is_special_token(ch)) {
        return {
            text: take(s),
            token: ch
        }
    }

    /* eat double quoted string */
    if (ch === DOUBLE_QUOTE) {
        let res = '';
        do {
            ch = peek(s);
            res += ch;
            s = take(s);
        } while (peek(s) !== DOUBLE_QUOTE);
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
    while (peek(s) && !is_whitespace(peek(s)) && !is_special_token(peek(s))) {
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
