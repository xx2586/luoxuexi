# 个人博客网站

这是一个不依赖构建工具的 Markdown 静态博客，适合先整理内容和视觉方向。

## 如何预览

因为浏览器读取 Markdown 文件需要通过本地服务预览，推荐运行：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://127.0.0.1:4173/
```

## 如何发布文章

1. 在 `posts/` 文件夹里新增一篇 Markdown 文件，例如：

```text
posts/my-first-post.md
```

2. 在 `posts.json` 里新增文章信息：

```json
{
  "slug": "my-first-post",
  "title": "文章标题",
  "date": "2026-06-19",
  "readingTime": "6 分钟",
  "tags": ["写作", "生活"],
  "excerpt": "文章摘要。",
  "file": "posts/my-first-post.md"
}
```

3. 文章会自动出现在首页，链接格式是：

```text
?post=my-first-post
```

## 如何上线

最简单的路径：

1. 把这个文件夹上传到 GitHub 仓库。
2. 使用 GitHub Pages、Netlify 或 Vercel 部署。
3. 购买域名后，在部署平台绑定域名。

如果你想要 Markdown 写作、RSS、分类页和自动生成文章页面，下一步可以迁移到 Astro 或 Next.js。
