const tokenize = require('./tokenize');
const {
    DOUBLE_QUOTE,
    SINGLE_QUOTE,
    OPEN_PAREN,
    CLOSE_PAREN,
    SEMICOLON,
    NEWLINE,
    TRUE,
    FALSE,
    QUOTE_SYM
} = require('./constants');

class UnexpectedTokenError extends Error {
    constructor(token) {
        super(`Unexpected token "${token}"`);
    }
}

class UnexpectedEndOfFileError extends Error {
    constructor() {
        super('Unexpected end of file');
    }
}

const atom = (token) => {
    if (token === TRUE) return true;
    else if (token === FALSE) return false;
    else if (token[0] === DOUBLE_QUOTE) return token.substring(1, token.length-1);
    else {
        const n = Number(token);
        return isNaN(n) ? Symbol.for(token) : n;
    }
}

const list = (tokens, L = []) => {
    while (tokens[0] !== CLOSE_PAREN) L.push(read_from_tokens(tokens));
    tokens.shift();
    return L;
}

const read_from_tokens = (tokens) => {
    if (tokens.length === 0) throw new UnexpectedEndOfFileError();
    let token = tokens.shift();
    if (token === OPEN_PAREN) {
        return list(tokens);
    } else if (token === CLOSE_PAREN) {
        throw new UnexpectedTokenError(token);
    } else if (token === SINGLE_QUOTE) {
        token = tokens.shift();
        if (token !== OPEN_PAREN) throw new UnexpectedTokenError(token);
        return list(tokens, [QUOTE_SYM]);
    } else if (token === SEMICOLON) {
        while (tokens.length && tokens.shift() !== NEWLINE);
    } else {
        return atom(token);
    }
};

exports.read = (text) => read_from_tokens(tokenize(text));

