const tokenize = require('./tokenize');

const atom = (token) => {
    if (token === 'true') return true;
    else if (token === 'false') return false;
    else if (token[0] === '"') return token.substring(1, token.length-1);
    else {
        const n = Number(token);
        return isNaN(n) ? Symbol.for(token) : n;
    }
}

const read_from_tokens = (tokens) => {
    if (tokens.length === 0) throw Error('Unexpected end of file');
    const token = tokens.shift();
    if (token === '(') {
        const L = [];
        while (tokens[0] !== ')') L.push(read_from_tokens(tokens));
        tokens.shift();
        return L;
    } else if (token === ')') {
        throw Error('Unexpected token ")"');
    } else {
        return atom(token);
    }
};

exports.read = (text) => read_from_tokens(tokenize(text));

