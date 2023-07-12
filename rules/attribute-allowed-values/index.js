const { is_tag_node, has_non_empty_attribute, is_boolean_attribute } = require("@linthtml/dom-utils");

module.exports = {
  name: "htmlacademy/attribute-allowed-values",
  lint(node, rule_config, { report }) {
    if (is_tag_node(node) && node.name.chars in rule_config) {
      const { attributes: restrictedAttributes } = rule_config[node.name.chars];
      const attributes = node.attributes.filter(
          (attribute) => /^¤+$/.test(attribute.name.chars) === false
          && has_non_empty_attribute(node, attribute.name.chars) && !is_boolean_attribute(attribute)
          && attribute.name.chars in restrictedAttributes
      );
      attributes.forEach((attribute) => {
        const { enum: allowedValues } = restrictedAttributes[attribute.name.chars];
        const value = attribute.value.chars.toLowerCase()
        if (!allowedValues.includes(value)) {
          const name = attribute.name.chars;
          report({
            position: attribute.loc,
            message: `${value} is not allowed for ${name} in <${node.name.chars}>`,
          });
        }
      });
    }
  }
}
