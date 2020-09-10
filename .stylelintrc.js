module.exports = {
    "extends": ["stylelint-config-standard", "stylelint-config-prettier"],
    "rules": {
        "no-descending-specificity": null,
        "selector-pseudo-class-no-unknown": [
            true,
            {
                "ignorePseudoClasses": ["global"]
            }
        ],
        "selector-pseudo-element-colon-notation": "single"
    }
};
