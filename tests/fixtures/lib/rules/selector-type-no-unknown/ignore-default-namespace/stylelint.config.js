"use strict"

module.exports = {
    extends: ["stylelint-plugin-stylus/base-config"],
    rules: {
        "stylus/selector-type-no-unknown": [true, {ignore: ["default-namespace"]}],
    },
}
