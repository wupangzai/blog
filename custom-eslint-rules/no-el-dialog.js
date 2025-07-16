export default {
  meta: {
    type: "problem",
    docs: {
      description: "禁止使用el-dialog",
      recommended: false,
    },
    messages: {
      noElDialog: "禁止使用el-dialog, 请用 useDialog 函数",
      test1: "test1",
    },
    schema: [], // 无参数
  },
  create(context) {
    return {
      "*": (node) => {
        if (node.templateBody?.type === "VElement") {
          node.templateBody.tokens.forEach((node) => {
            if (node.value === "el-dialog") {
              context.report({
                node,
                messageId: "noElDialog",
              });
            }
          });
        }
      },
    };
  },
};
