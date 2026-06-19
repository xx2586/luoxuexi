let posts = [];

const state = {
  activeTag: "全部",
  query: ""
};

const homeSections = [
  document.querySelector(".hero"),
  document.querySelector(".toolbar"),
  document.querySelector(".featured"),
  document.querySelector("#articles"),
  document.querySelector("#about"),
  document.querySelector("#subscribe")
];

const postGrid = document.querySelector("#postGrid");
const tagFilters = document.querySelector("#tagFilters");
const searchInput = document.querySelector("#searchInput");
const featuredPost = document.querySelector("#featuredPost");
const resultCount = document.querySelector("#resultCount");
const postView = document.querySelector("#postView");
const postViewDate = document.querySelector("#postViewDate");
const postViewTitle = document.querySelector("#postViewTitle");
const postViewExcerpt = document.querySelector("#postViewExcerpt");
const postViewTags = document.querySelector("#postViewTags");
const postContent = document.querySelector("#postContent");

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = [];
  let inCode = false;
  let codeLines = [];
  let codeLanguage = "";

  function flushParagraph() {
    if (paragraph.length === 0) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) return;
    html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCode = false;
        codeLines = [];
        codeLanguage = "";
      } else {
        flushParagraph();
        flushList();
        inCode = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      list.push(listItem[1]);
      continue;
    }

    const quote = line.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return html.join("");
}

function getAllTags() {
  const tagSet = new Set(posts.flatMap((post) => post.tags));
  return ["全部", ...tagSet];
}

function matchesPost(post) {
  const searchText = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
  const matchesQuery = searchText.includes(state.query.toLowerCase());
  const matchesTag = state.activeTag === "全部" || post.tags.includes(state.activeTag);
  return matchesQuery && matchesTag;
}

function renderTags() {
  tagFilters.innerHTML = getAllTags()
    .map((tag) => {
      const activeClass = tag === state.activeTag ? " active" : "";
      return `<button class="tag-button${activeClass}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
    })
    .join("");
}

function postHref(post) {
  return `?post=${encodeURIComponent(post.slug)}`;
}

function tagTemplate(tags) {
  return tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("");
}

function postTemplate(post) {
  return `
    <article class="post-card">
      <div class="post-meta">
        <span>${formatDate(post.date)}</span>
        <span>${escapeHtml(post.readingTime)}</span>
      </div>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt)}</p>
      <div class="post-tags">
        ${tagTemplate(post.tags)}
      </div>
      <a class="read-link" href="${postHref(post)}">阅读全文</a>
    </article>
  `;
}

function renderFeatured() {
  const post = posts[0];
  if (!post) return;
  featuredPost.innerHTML = `
    <div class="post-meta">
      <span>${formatDate(post.date)}</span>
      <span>${escapeHtml(post.readingTime)}</span>
    </div>
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.excerpt)}</p>
    <div class="post-tags">
      ${tagTemplate(post.tags)}
    </div>
    <a class="read-link" href="${postHref(post)}">阅读全文</a>
  `;
}

function renderPosts() {
  const filteredPosts = posts.filter(matchesPost);
  resultCount.textContent = `${filteredPosts.length} 篇文章`;

  if (filteredPosts.length === 0) {
    postGrid.innerHTML = `<p class="empty">没有找到相关文章。换个关键词试试。</p>`;
    return;
  }

  postGrid.innerHTML = filteredPosts.map(postTemplate).join("");
}

function showHome() {
  homeSections.forEach((section) => {
    section.hidden = false;
  });
  postView.hidden = true;
}

async function showPost(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    showHome();
    postGrid.innerHTML = `<p class="empty">没有找到这篇文章。你可以回到文章列表重新选择。</p>`;
    return;
  }

  homeSections.forEach((section) => {
    section.hidden = true;
  });
  postView.hidden = false;
  postViewDate.textContent = `${formatDate(post.date)} / ${post.readingTime}`;
  postViewTitle.textContent = post.title;
  postViewExcerpt.textContent = post.excerpt;
  postViewTags.innerHTML = tagTemplate(post.tags);
  postContent.innerHTML = `<p class="muted">正在加载文章...</p>`;

  const response = await fetch(post.file);
  if (!response.ok) {
    postContent.innerHTML = `<p class="empty">文章文件暂时无法加载。</p>`;
    return;
  }

  const markdown = await response.text();
  postContent.innerHTML = markdownToHtml(markdown);
  document.title = `${post.title} - 我的写作现场`;
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function loadPosts() {
  const response = await fetch("posts.json");
  posts = await response.json();
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function init() {
  await loadPosts();
  renderTags();
  renderFeatured();
  renderPosts();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");
  if (slug) {
    await showPost(slug);
  } else {
    showHome();
  }
}

tagFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-tag]");
  if (!button) return;
  state.activeTag = button.dataset.tag;
  renderTags();
  renderPosts();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderPosts();
});

document.querySelector(".subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  alert("订阅表单已提交。上线后可以把这里接到邮件服务。");
});

document.querySelector("#year").textContent = new Date().getFullYear();

init();
