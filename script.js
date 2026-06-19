const posts = [
  {
    title: "如何开始一个长期博客",
    date: "2026-06-19",
    readingTime: "6 分钟",
    tags: ["写作", "博客"],
    excerpt: "从主题、节奏和发布系统开始，把博客做成可以长期容纳思考的地方。",
    url: "#"
  },
  {
    title: "把读书笔记写成可复用的想法",
    date: "2026-06-12",
    readingTime: "8 分钟",
    tags: ["读书", "方法"],
    excerpt: "笔记不是摘抄的仓库，而是一次把别人的表达变成自己语言的练习。",
    url: "#"
  },
  {
    title: "一个项目结束后，我通常会复盘什么",
    date: "2026-05-28",
    readingTime: "5 分钟",
    tags: ["复盘", "项目"],
    excerpt: "结果、过程、判断、沟通和下次要保留的习惯，是我最常用的五个切入点。",
    url: "#"
  },
  {
    title: "写作时如何处理还不成熟的观点",
    date: "2026-05-10",
    readingTime: "7 分钟",
    tags: ["写作", "思考"],
    excerpt: "不是所有文章都要给结论。有些文章的价值，是把问题摆到更准确的位置。",
    url: "#"
  }
];

const state = {
  activeTag: "全部",
  query: ""
};

const postGrid = document.querySelector("#postGrid");
const tagFilters = document.querySelector("#tagFilters");
const searchInput = document.querySelector("#searchInput");
const featuredPost = document.querySelector("#featuredPost");
const resultCount = document.querySelector("#resultCount");

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
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
      return `<button class="tag-button${activeClass}" type="button" data-tag="${tag}">${tag}</button>`;
    })
    .join("");
}

function postTemplate(post) {
  return `
    <article class="post-card">
      <div class="post-meta">
        <span>${formatDate(post.date)}</span>
        <span>${post.readingTime}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="post-tags">
        ${post.tags.map((tag) => `<span>#${tag}</span>`).join("")}
      </div>
      <a class="read-link" href="${post.url}">阅读全文</a>
    </article>
  `;
}

function renderFeatured() {
  const post = posts[0];
  featuredPost.innerHTML = `
    <div class="post-meta">
      <span>${formatDate(post.date)}</span>
      <span>${post.readingTime}</span>
    </div>
    <h3>${post.title}</h3>
    <p>${post.excerpt}</p>
    <div class="post-tags">
      ${post.tags.map((tag) => `<span>#${tag}</span>`).join("")}
    </div>
    <a class="read-link" href="${post.url}">阅读全文</a>
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

renderTags();
renderFeatured();
renderPosts();
