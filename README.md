# 个人博客网站

这是一个不依赖构建工具的静态博客雏形，适合先整理内容和视觉方向。

## 如何预览

直接用浏览器打开 `index.html`。

## 如何发布文章

打开 `script.js`，在 `posts` 数组里新增文章：

```js
{
  title: "文章标题",
  date: "2026-06-19",
  readingTime: "6 分钟",
  tags: ["写作", "生活"],
  excerpt: "文章摘要。",
  url: "#"
}
```

如果之后想把每篇文章做成独立页面，可以把 `url` 改成类似 `posts/my-first-post.html` 的路径。

## 如何上线

最简单的路径：

1. 把这个文件夹上传到 GitHub 仓库。
2. 使用 GitHub Pages、Netlify 或 Vercel 部署。
3. 购买域名后，在部署平台绑定域名。

如果你想要 Markdown 写作、RSS、分类页和自动生成文章页面，下一步可以迁移到 Astro 或 Next.js。
