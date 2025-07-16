export default {
  // 继承的规则，采用官方推荐的规范
  extends: ['@commitlint/config-conventional'],
  // 自定义规则
  rules: {
    // 提交类型必须符合下列类型之一
    'type-enum': [
      2, // 0 — 关闭该规则，不做校验,1 — 警告（warn），违反规则时只提示但不阻止提交,  2 — 错误（error），违反规则时阻止提交，必须修正
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式修改，不影响逻辑
        'refactor', // 代码重构，无功能或 bug 修复
        'perf', // 性能优化
        'test', // 添加测试
        'chore', // 构建工具或其他依赖变动
        'revert', // 回滚操作
        'build', // 构建打包相关
        'core',
      ],
    ],
  },
};
