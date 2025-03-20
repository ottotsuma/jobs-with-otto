// module.exports = {
//     plugins: ["i18n"],
//     parser: "@typescript-eslint/parser",
//     extends: ["plugin:@typescript-eslint/recommended"],
//     rules: {
//         "no-raw-text": "error",
//         "i18n/no-text-as-children": "error", // Disallow raw text in JSX
//         "i18n/no-text-as-attribute": "error" // Disallow raw text inside attributes
//     }
// };

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Disallow raw text, enforce usage of i18n",
        },
        messages: {
            noRawText: "Use i18n translation function instead of hardcoded text.",
        },
    },
    create(context) {
        return {
            Literal(node) {
                if (typeof node.value === "string" && /[a-zA-Z]/.test(node.value)) {
                    context.report({
                        node,
                        messageId: "noRawText",
                    });
                }
            },
            JSXText(node) {
                if (node.value.trim().length > 0) {
                    context.report({
                        node,
                        messageId: "noRawText",
                    });
                }
            },
        };
    },
};
