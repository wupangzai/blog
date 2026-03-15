# CHANGELOG

## 2026-03-15

### 概要

本次更新主要聚焦前台 `C` 端移动端适配、文章与知识库详情页体验优化、搜索弹窗移动端适配，以及新增通用的回到顶部功能组件。

### 修改方案

#### 1. 前台整体移动端适配

- 将前台主布局从固定双栏为主的 PC 样式调整为响应式布局。
- 在中小屏下将内容区和侧栏改为单列展示，并统一收缩内边距、间距与卡片尺寸。
- 保持后台 `/admin` 页面不参与本次适配。

涉及文件：

- [src/components/page-content/index.vue](/d:/Code/vue-vite-template/src/components/page-content/index.vue)
- [src/components/common/page-header/index.vue](/d:/Code/vue-vite-template/src/components/common/page-header/index.vue)
- [src/components/common/page-header/header-content.vue](/d:/Code/vue-vite-template/src/components/common/page-header/header-content.vue)
- [src/components/common/page-header/content-btns.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-btns.vue)
- [src/components/common/page-header/content-operations/content-operations.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/content-operations.vue)

#### 2. 前台卡片与列表移动端适配

- 调整公告栏、首页文章卡片、文章列表卡片、知识库卡片、侧栏个人卡片与分类/标签卡片的宽度、间距、换行和 hover 表现。
- 优化分类页、标签页、归档页、知识库列表页在手机端的内边距与分页布局。

涉及文件：

- [src/components/common/notice-board/index.vue](/d:/Code/vue-vite-template/src/components/common/notice-board/index.vue)
- [src/components/common/page-article-list-card/index.vue](/d:/Code/vue-vite-template/src/components/common/page-article-list-card/index.vue)
- [src/components/common/wiki-card/index.vue](/d:/Code/vue-vite-template/src/components/common/wiki-card/index.vue)
- [src/components/common/side-bar/card-container/profile-card.vue](/d:/Code/vue-vite-template/src/components/common/side-bar/card-container/profile-card.vue)
- [src/components/common/side-bar/card-container/tags-card.vue](/d:/Code/vue-vite-template/src/components/common/side-bar/card-container/tags-card.vue)
- [src/components/home-page/index.vue](/d:/Code/vue-vite-template/src/components/home-page/index.vue)
- [src/components/home-page/list-page-card.vue](/d:/Code/vue-vite-template/src/components/home-page/list-page-card.vue)
- [src/components/categories/index.vue](/d:/Code/vue-vite-template/src/components/categories/index.vue)
- [src/components/label/index.vue](/d:/Code/vue-vite-template/src/components/label/index.vue)
- [src/components/achieve/index.vue](/d:/Code/vue-vite-template/src/components/achieve/index.vue)
- [src/components/wiki/index.vue](/d:/Code/vue-vite-template/src/components/wiki/index.vue)

#### 3. 文章详情页与知识库详情页优化

- 将详情页布局从 PC 双栏模式调整为移动端优先的单列阅读模式。
- 在移动端中将目录区域提前到正文上方，提升手机阅读时的导航可用性。
- 文章详情页中，个人卡片、分类卡片、标签卡片仅在移动端隐藏，桌面端保持原样。
- 知识库详情页同步优化左侧导航、右侧目录和正文的堆叠顺序。

涉及文件：

- [src/components/article/index.vue](/d:/Code/vue-vite-template/src/components/article/index.vue)
- [src/components/article/article-header.vue](/d:/Code/vue-vite-template/src/components/article/article-header.vue)
- [src/components/article/article-toc/index.vue](/d:/Code/vue-vite-template/src/components/article/article-toc/index.vue)
- [src/components/wiki-detail/index.vue](/d:/Code/vue-vite-template/src/components/wiki-detail/index.vue)
- [src/components/wiki-detail/wiki-nav/index.vue](/d:/Code/vue-vite-template/src/components/wiki-detail/wiki-nav/index.vue)
- [src/components/common/side-bar/index.vue](/d:/Code/vue-vite-template/src/components/common/side-bar/index.vue)

#### 4. 搜索弹窗移动端适配

- 调整搜索弹窗宽度计算逻辑，避免小屏下内容溢出。
- 修复弹窗内容容器偏左问题，改为随弹窗宽度自适应并居中。
- 调整搜索输入区、底部说明区、搜索按钮在移动端的排版与间距。
- 在移动端隐藏顶部右侧可进入后台的下拉头像，避免头部挤压。

涉及文件：

- [src/hooks/ui-hooks/use-crtl-k-search/index.ts](/d:/Code/vue-vite-template/src/hooks/ui-hooks/use-crtl-k-search/index.ts)
- [src/components/common/page-header/content-operations/search-dialog-content.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/search-dialog-content.vue)
- [src/components/common/page-header/content-operations/search-dialog-header.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/search-dialog-header.vue)
- [src/components/common/page-header/content-operations/search-dialog-footer.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/search-dialog-footer.vue)
- [src/components/common/page-header/content-operations/operation-search.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/operation-search.vue)
- [src/components/common/page-header/content-operations/content-operations.vue](/d:/Code/vue-vite-template/src/components/common/page-header/content-operations/content-operations.vue)

#### 5. 新增回到顶部功能组件

- 新增通用组件 `back-to-top`，供文章详情页和知识库详情页复用。
- 组件固定在视口右下角。
- 页面发生向下滚动时显示，回到顶部后消失。
- 组件通过 `teleport` 挂载到 `body`，避免受到详情页布局容器影响。

涉及文件：

- [src/components/common/back-to-top/index.vue](/d:/Code/vue-vite-template/src/components/common/back-to-top/index.vue)
- [src/components/article/index.vue](/d:/Code/vue-vite-template/src/components/article/index.vue)
- [src/components/wiki-detail/index.vue](/d:/Code/vue-vite-template/src/components/wiki-detail/index.vue)

### 影响范围

#### 直接影响

- 前台首页、分类页、标签页、归档页、知识库列表页
- 前台文章详情页、知识库详情页
- 前台顶部导航、搜索弹窗、侧栏卡片

#### 不受影响

- 后台 `/admin` 页面
- 登录页主要结构与交互逻辑
- API 层与数据请求逻辑

### 风险与说明

- 本次以样式和前端交互调整为主，未修改后端接口和业务数据结构。
- 过程中多次对移动端展示顺序与隐藏策略进行回退和重做，当前文档仅保留最终生效方案。
- 当前未完成构建命令校验记录；若后续需要发布，建议补跑一次 `npm run build` 和主要页面的移动端真机检查。
