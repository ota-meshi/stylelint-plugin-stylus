"use strict"

const { scopedTokens, isSkipToken } = require("../tokens")
const { getLang } = require("../nodes")

module.exports = {
    getSelectorTokens,
    isSelectorToken,
    setSelector,
}

function getSelectorTokens(selectorText) {
    const selectors = []
    let selector = []
    let linebreak = null
    for (const { token, scope } of scopedTokens(selectorText)) {
        if (token.value === "," && scope.level === 0) {
            selector.push(token)
            selectors.push({
                selector,
                separater: token,
            })
            selector = []
            linebreak = null
        } else if (
            token.type === "linebreak" &&
            scope.level === 0 &&
            selector.some(t => !isSkipToken(t))
        ) {
            selector.push(token)
            linebreak = token
        } else if (linebreak && !isSkipToken(token)) {
            selectors.push({
                selector,
                separater: linebreak,
            })
            selector = []
            linebreak = null
            selector.push(token)
        } else {
            selector.push(token)
        }
    }
    if (selector.length > 0) {
        selectors.push({
            selector,
            separater: null,
        })
    }

    return selectors
}

function isSelectorToken(token) {
    return token && (!isSkipToken(token) || isLinebreak(token))
}

function isLinebreak(token) {
    return token && token.type === "linebreak"
}

function setSelector(node, selector) {
    if (!node.raws.selector) {
        node.raws.selector = {
            value: node.selector,
            raw: node.selector,
        }
    }
    if (getLang(node) === "stylus") {
        node.raws.selector.stylus = selector
    } else {
        node.raws.selector.raw = selector
    }
}