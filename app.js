(function () {
  "use strict";

  const app = document.querySelector("#app");
  const root = document.documentElement;
  const toast = document.querySelector("[data-toast]");
  const categories = window.BLOG_CATEGORIES || [];
  const posts = window.BLOG_POSTS || [];
  const storageKeys = {
    comments: "fieldnotes.comments.v1",
    likes: "fieldnotes.likes.v1",
    theme: "fieldnotes.theme.v1"
  };
  let activeMediaFilter = "all";
  let toastTimeout;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function readStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("Fieldnotes could not read saved preferences.", error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Fieldnotes could not save this change.", error);
      showToast("Your browser could not save this change. Check your storage settings.");
      return false;
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  function getRoute() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    const separator = raw.indexOf("?");
    const path = separator === -1 ? raw : raw.slice(0, separator);
    const params = new URLSearchParams(separator === -1 ? "" : raw.slice(separator + 1));
    let segments;
    try {
      segments = path.split("/").filter(Boolean).map(function (part) { return decodeURIComponent(part); });
    } catch (error) {
      console.warn("Fieldnotes received an invalid route.", error);
      return { name: "not-found", params: params };
    }
    if (segments.length === 0) return { name: "home", params: params };
    if (segments[0] === "blog") return { name: "listing", params: params };
    if (segments[0] === "categories" && segments[1]) return { name: "category", slug: segments[1], params: params };
    if (segments[0] === "tags" && segments[1]) return { name: "tag", slug: segments[1], params: params };
    if (segments[0] === "post" && segments[1]) return { name: "detail", slug: segments[1], params: params };
    return { name: "not-found", params: params };
  }

  function routeHref(type, value) {
    return "#/" + type + "/" + encodeURIComponent(value);
  }

  function imageUrl(id, width) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + (width || 900) + "&q=82";
  }

  function getLikedIds() {
    const ids = readStorage(storageKeys.likes, []);
    return Array.isArray(ids) ? ids : [];
  }

  function getComments() {
    const comments = readStorage(storageKeys.comments, {});
    return comments && typeof comments === "object" && !Array.isArray(comments) ? comments : {};
  }

  function getCommentsForPost(post) {
    const list = getComments()[post.id];
    return Array.isArray(list) ? list : [];
  }

  function getLikeCount(post) {
    return post.likes + (getLikedIds().includes(post.id) ? 1 : 0);
  }

  function mediaLabel(type) {
    return { image: "Photo essay", video: "Short film", audio: "Listen" }[type] || "Story";
  }

  function mediaSymbol(type) {
    return { image: "▧", video: "▶", audio: "♫" }[type] || "•";
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date + "T12:00:00"));
  }

  function authorAvatar(author) {
    return '<span class="avatar" aria-hidden="true">' + escapeHtml(author.initials) + "</span>";
  }

  function renderCard(post, showFeatured) {
    const liked = getLikedIds().includes(post.id);
    return [
      '<article class="post-card"><a class="post-card-image" href="' + routeHref("post", post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">',
      '<img src="' + imageUrl(post.image, 760) + '" alt="' + escapeHtml(post.alt) + '" loading="lazy" decoding="async">',
      '<span class="media-badge"><span class="media-badge-icon" aria-hidden="true">' + mediaSymbol(post.media) + "</span>" + mediaLabel(post.media) + "</span>",
      showFeatured && post.featured ? '<span class="featured-badge">Editor’s pick</span>' : "",
      '</a><div class="post-card-body"><a class="post-card-category" href="' + routeHref("categories", post.categorySlug) + '">' + escapeHtml(post.category) + "</a>",
      '<a class="post-card-title" href="' + routeHref("post", post.slug) + '">' + escapeHtml(post.title) + "</a>",
      '<p class="post-card-excerpt">' + escapeHtml(post.excerpt) + '</p><div class="post-card-meta">',
      authorAvatar(post.author), '<span class="meta-author">' + escapeHtml(post.author.name) + "</span>",
      '<span class="meta-divider" aria-hidden="true">·</span><span>' + formatDate(post.date) + "</span>",
      '<span class="meta-divider" aria-hidden="true">·</span><span class="post-stat"><span aria-hidden="true">' + (liked ? "♥" : "♡") + "</span>" + getLikeCount(post) + "</span>",
      "</div></div></article>"
    ].join("");
  }

  function renderSidebar() {
    const popular = posts.slice().sort(function (a, b) { return b.views - a.views; }).slice(0, 4);
    const counts = categories.map(function (category) {
      return { category: category, count: posts.filter(function (post) { return post.categorySlug === category.slug; }).length };
    });
    const tags = Array.from(new Set(posts.reduce(function (all, post) { return all.concat(post.tags); }, []))).slice(0, 14);
    return [
      '<aside class="sidebar" aria-label="Discover more"><section class="sidebar-block"><h2 class="sidebar-title">Most read</h2><div class="popular-list">',
      popular.map(function (post, index) {
        return '<div class="popular-item"><span class="popular-number">' + String(index + 1).padStart(2, "0") + '</span><div><a href="' + routeHref("post", post.slug) + '">' + escapeHtml(post.title) + '</a><span>' + post.views.toLocaleString() + " reads · " + escapeHtml(post.readTime) + "</span></div></div>";
      }).join(""),
      '</div></section><section class="sidebar-block"><h2 class="sidebar-title">Browse by topic</h2><div class="category-list">',
      counts.map(function (entry) {
        return '<a class="category-link" href="' + routeHref("categories", entry.category.slug) + '"><span>' + escapeHtml(entry.category.name) + "</span><span>" + entry.count + "</span></a>";
      }).join(""),
      '</div></section><section class="sidebar-block"><h2 class="sidebar-title">A few good tags</h2><div class="tag-cloud">',
      tags.map(function (tag) { return '<a class="tag-link" href="' + routeHref("tags", slugify(tag)) + '">' + escapeHtml(tag) + "</a>"; }).join(""),
      "</div></section></aside>"
    ].join("");
  }

  function renderHome() {
    const featured = posts.find(function (post) { return post.featured; }) || posts[0];
    const latest = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    const media = posts.filter(function (post) { return post.media !== "image"; });
    return [
      '<section class="home-hero" aria-labelledby="hero-title"><div class="hero-copy"><span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>An independent journal</span>',
      '<h1 id="hero-title">Stories worth slowing down for.</h1><p>Thoughtful words, images, film, and sound for the endlessly curious.</p>',
      '<a class="button button-ghost" href="' + routeHref("post", featured.slug) + '">Read the latest story <span class="button-arrow" aria-hidden="true">→</span></a></div>',
      '<a class="hero-image" href="' + routeHref("post", featured.slug) + '" aria-label="Read ' + escapeHtml(featured.title) + '"><img src="' + imageUrl(featured.image, 1200) + '" alt="' + escapeHtml(featured.alt) + '" fetchpriority="high">',
      '<span class="hero-image-caption">' + escapeHtml(featured.caption) + "</span></a></section>",
      '<div class="content-layout"><section class="feed-column" aria-labelledby="editors-heading"><div class="section-heading"><div><span class="eyebrow">Hand-picked for you</span><h2 id="editors-heading">Editor’s picks</h2><p>Good things to read, watch, and listen to today.</p></div><a class="text-link" href="#/blog">All stories</a></div>',
      '<div class="story-grid">' + latest.slice(0, 4).map(function (post) { return renderCard(post, true); }).join("") + "</div></section>",
      renderSidebar(), "</div>",
      '<section class="home-latest" aria-labelledby="latest-heading"><div class="section-heading"><div><span class="eyebrow">Fresh from the journal</span><h2 id="latest-heading">Latest stories</h2><p>The newest things we’ve been making.</p></div><a class="text-link" href="#/blog">Explore all</a></div>',
      '<div class="story-grid">' + latest.slice(4).map(function (post) { return renderCard(post, false); }).join("") + "</div></section>",
      '<section class="media-strip" aria-labelledby="media-heading"><div class="media-strip-header"><div><h2 id="media-heading">Beyond the page</h2><p>Press play, settle in, and stay a while.</p></div><a class="text-link" href="#/blog">See every story</a></div>',
      '<div class="story-grid">' + media.map(function (post) { return renderCard(post, false); }).join("") + "</div></section>",
      '<section class="newsletter-banner" aria-label="Stay curious"><div><h2>A little something to look forward to.</h2><p>New stories, delivered when they’re ready. No rush, no noise.</p></div><span class="newsletter-mark" aria-hidden="true">✳</span></section>'
    ].join("");
  }

  function filterPosts(route) {
    let filtered = posts.slice();
    const query = (route.params.get("q") || "").trim();
    if (route.name === "category") {
      filtered = filtered.filter(function (post) { return post.categorySlug === route.slug; });
    } else if (route.name === "tag") {
      filtered = filtered.filter(function (post) { return post.tags.some(function (tag) { return slugify(tag) === route.slug; }); });
    }
    if (activeMediaFilter !== "all") filtered = filtered.filter(function (post) { return post.media === activeMediaFilter; });
    if (query) {
      const term = query.toLocaleLowerCase();
      filtered = filtered.filter(function (post) {
        return [post.title, post.excerpt, post.author.name, post.category, post.tags.join(" ")].join(" ").toLocaleLowerCase().includes(term);
      });
    }
    return { results: filtered, query: query };
  }

  function renderListing(route) {
    const result = filterPosts(route);
    const category = route.name === "category" && categories.find(function (entry) { return entry.slug === route.slug; });
    const tag = route.name === "tag" && posts.reduce(function (all, post) { return all.concat(post.tags); }, []).find(function (item) { return slugify(item) === route.slug; });
    const heading = category ? category.name : tag || (result.query ? "Search results" : "The journal");
    const description = category ? category.description : tag ? "Stories filed under " + tag + "." : result.query ? "A few good reads for “" + result.query + "”." : "Ideas and impressions from the places we go, the things we make, and the moments in between.";
    const filters = [["all", "Everything"], ["image", "Photography"], ["video", "Film"], ["audio", "Listening"]];
    const label = result.query ? "Search results for “" + escapeHtml(result.query) + "”" : "Showing " + heading;
    const cards = result.results.length
      ? '<div class="story-grid">' + result.results.map(function (post) { return renderCard(post, true); }).join("") + "</div>"
      : '<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">⌕</span><h2>No stories found just yet.</h2><p>Try a different search, or clear the media filter to see everything in the journal.</p><a class="text-link" href="#/blog">Browse all stories</a></div>';
    return [
      '<section class="page-intro"><span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>Fieldnotes journal</span><h1>' + escapeHtml(heading) + "</h1><p>" + escapeHtml(description) + "</p></section>",
      '<section class="listing-page" aria-label="Blog stories"><div class="listing-tools"><div class="filter-list" role="group" aria-label="Filter stories by format">',
      filters.map(function (filter) { return '<button class="filter-chip" type="button" data-media-filter="' + filter[0] + '" aria-pressed="' + (activeMediaFilter === filter[0]) + '">' + filter[1] + "</button>"; }).join(""),
      '</div><span class="result-count">' + label + " · " + result.results.length + (result.results.length === 1 ? " story" : " stories") + "</span></div>" + cards + "</section>"
    ].join("");
  }

  function renderMediaPlayer(post) {
    if (post.media === "audio" && post.audioUrl) {
      return '<section class="media-player" aria-label="Audio player"><div class="media-player-heading"><span class="media-player-art" aria-hidden="true">♫</span><span class="media-player-title">' + escapeHtml(post.title) + '<span class="media-player-subtitle">Audio sample · ' + escapeHtml(post.readTime) + '</span></span></div><audio controls preload="none" src="' + escapeHtml(post.audioUrl) + '">Your browser does not support embedded audio. <a href="' + escapeHtml(post.audioUrl) + '">Open the audio</a>.</audio><p class="media-player-note">Demo audio streams from an external source; replace with the published episode file when available.</p></section>';
    }
    if (post.media === "video" && post.videoUrl) {
      return '<section class="media-player" aria-label="Video player"><video controls preload="none" poster="' + imageUrl(post.image, 1100) + '"><source src="' + escapeHtml(post.videoUrl) + '" type="video/mp4">Your browser does not support embedded video.</video><p class="media-player-note">Demo video streams from an external source; replace with the published film when available.</p></section>';
    }
    return "";
  }

  function renderCommentItems(post) {
    const comments = getCommentsForPost(post);
    return comments.length
      ? comments.slice().reverse().map(function (comment) {
          return '<article class="comment-item"><span class="avatar" aria-hidden="true">' + escapeHtml(comment.initials) + '</span><div class="comment-content"><div class="comment-meta"><span class="comment-author">' + escapeHtml(comment.name) + '</span><time class="comment-date" datetime="' + escapeHtml(comment.date) + '">' + escapeHtml(comment.dateLabel) + '</time></div><p>' + escapeHtml(comment.body) + "</p></div></article>";
        }).join("")
      : '<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">✎</span><h2>Start the conversation.</h2><p>There aren’t any comments yet. Leave the first thoughtful note.</p></div>';
  }

  function renderComments(post) {
    const count = getCommentsForPost(post).length;
    return [
      '<section class="comments-section" id="comments" aria-labelledby="comments-heading"><div class="comments-heading"><h2 id="comments-heading">Conversation</h2><span data-comment-count>' + count + (count === 1 ? " note" : " notes") + "</span></div>",
      '<form class="comment-form" data-comment-form data-post-id="' + escapeHtml(post.id) + '" novalidate>',
      '<div class="field"><label for="comment-name">Your name</label><input id="comment-name" name="name" maxlength="48" autocomplete="name" required placeholder="How should we call you?"></div>',
      '<div class="field"><label for="comment-email">Email <span>(not shown)</span></label><input id="comment-email" name="email" type="email" maxlength="120" autocomplete="email" required placeholder="you@example.com"></div>',
      '<div class="field field-wide"><label for="comment-body">Your note</label><textarea id="comment-body" name="body" maxlength="1200" required placeholder="Add something kind to the conversation..."></textarea></div>',
      '<button class="button" type="submit">Leave a note <span class="button-arrow" aria-hidden="true">→</span></button></form>',
      '<div class="comment-list" data-comment-list>' + renderCommentItems(post) + "</div></section>"
    ].join("");
  }

  function renderDetail(post) {
    const paragraphs = post.paragraphs.map(function (paragraph, index) {
      const quote = index === 1 && post.quote ? "<blockquote>" + escapeHtml(post.quote) + "</blockquote>" : "";
      const player = index === 0 ? renderMediaPlayer(post) : "";
      return "<p>" + escapeHtml(paragraph) + "</p>" + quote + player;
    }).join("");
    const related = post.related.map(function (slug) { return posts.find(function (item) { return item.slug === slug; }); }).filter(Boolean);
    const liked = getLikedIds().includes(post.id);
    const commentCount = getCommentsForPost(post).length;
    return [
      '<article class="detail-page"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span aria-hidden="true">/</span><a href="#/blog">Journal</a><span aria-hidden="true">/</span><a href="' + routeHref("categories", post.categorySlug) + '">' + escapeHtml(post.category) + '</a><span aria-hidden="true">/</span><span>' + escapeHtml(post.title) + "</span></nav>",
      '<header class="detail-header"><span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span><a href="' + routeHref("categories", post.categorySlug) + '">' + escapeHtml(post.category) + "</a> · " + mediaLabel(post.media) + "</span>",
      "<h1>" + escapeHtml(post.title) + '</h1><p class="detail-dek">' + escapeHtml(post.excerpt) + '</p><div class="detail-byline">' + authorAvatar(post.author) + '<span class="byline-text"><span class="byline-author">' + escapeHtml(post.author.name) + '</span><time class="byline-date" datetime="' + escapeHtml(post.date) + '">' + escapeHtml(post.dateLabel) + " · " + escapeHtml(post.readTime) + "</time></span></div></header>",
      '<figure><img class="detail-cover" src="' + imageUrl(post.image, 1500) + '" alt="' + escapeHtml(post.alt) + '" fetchpriority="high"><figcaption class="detail-caption">' + escapeHtml(post.caption) + "</figcaption></figure>",
      '<div class="article-body">' + paragraphs + '</div><div class="detail-tags"><span class="detail-tags-label">Filed under</span><a class="tag-link" href="' + routeHref("categories", post.categorySlug) + '">' + escapeHtml(post.category) + "</a>",
      post.tags.map(function (tag) { return '<a class="tag-link" href="' + routeHref("tags", slugify(tag)) + '">' + escapeHtml(tag) + "</a>"; }).join(""),
      '</div><div class="detail-actions"><button class="like-button" type="button" data-like-button data-post-id="' + escapeHtml(post.id) + '" aria-pressed="' + liked + '" aria-label="' + (liked ? "Unlike this story" : "Like this story") + '"><span class="like-icon" aria-hidden="true">' + (liked ? "♥" : "♡") + '</span><span data-like-count>' + getLikeCount(post) + " appreciations</span></button>",
      '<div class="detail-action-meta"><span>' + post.views.toLocaleString() + ' reads</span><a href="#comments">' + commentCount + " comments ↓</a></div></div>",
      '<section class="author-card" aria-label="About the author">' + authorAvatar(post.author) + '<div><span class="author-card-name">' + escapeHtml(post.author.name) + '</span><p class="author-card-bio">' + escapeHtml(post.author.bio) + "</p></div></section>",
      renderComments(post),
      related.length ? '<section class="related-section" aria-labelledby="related-heading"><div class="section-heading"><div><span class="eyebrow">Keep wandering</span><h2 id="related-heading">You might also like</h2></div><a class="text-link" href="#/blog">All stories</a></div><div class="story-grid">' + related.map(function (item) { return renderCard(item, false); }).join("") + "</div></section>" : "",
      "</article>"
    ].join("");
  }

  function renderNotFound() {
    return '<section class="page-intro not-found"><span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>Just passing through</span><h1>That story wandered off.</h1><p>We couldn’t find that page, but there are plenty of good stories back at the journal.</p><p><a class="button" href="#/blog">Explore all stories <span class="button-arrow" aria-hidden="true">→</span></a></p></section>';
  }

  function updateNavigation(route) {
    document.querySelectorAll("[data-navigation] a").forEach(function (link) {
      const href = link.getAttribute("href");
      const active = route.name === "home" ? href === "#/" : route.name === "listing" ? href === "#/blog" : route.name === "category" && href === routeHref("categories", route.slug);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function render() {
    const route = getRoute();
    if (route.name === "home" || route.name === "detail" || route.name === "not-found") activeMediaFilter = "all";
    if (route.name === "home") {
      app.innerHTML = renderHome();
    } else if (route.name === "listing" || route.name === "category" || route.name === "tag") {
      const categoryExists = route.name !== "category" || categories.some(function (category) { return category.slug === route.slug; });
      const tagExists = route.name !== "tag" || posts.some(function (post) { return post.tags.some(function (tag) { return slugify(tag) === route.slug; }); });
      app.innerHTML = categoryExists && tagExists ? renderListing(route) : renderNotFound();
    } else if (route.name === "detail") {
      const post = posts.find(function (item) { return item.slug === route.slug; });
      app.innerHTML = post ? renderDetail(post) : renderNotFound();
    } else {
      app.innerHTML = renderNotFound();
    }
    app.setAttribute("aria-busy", "false");
    updateNavigation(route);
    const post = route.name === "detail" && posts.find(function (item) { return item.slug === route.slug; });
    document.title = post ? post.title + " — Fieldnotes" : route.name === "home" ? "Fieldnotes — Stories worth slowing down for" : "Explore stories — Fieldnotes";
  }

  function onSearchSubmit(event) {
    event.preventDefault();
    const form = event.target.closest("[data-search-form]");
    const query = String(new FormData(form).get("q") || "").trim();
    activeMediaFilter = "all";
    window.location.hash = query ? "/blog?q=" + encodeURIComponent(query) : "/blog";
    document.querySelector("[data-navigation]").classList.remove("is-open");
    document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", "false");
  }

  function onCommentSubmit(event) {
    const form = event.target.closest("[data-comment-form]");
    if (!form) return;
    event.preventDefault();
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    const body = String(values.get("body") || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.length < 4) {
      showToast("Please enter your name, a valid email, and a note of at least 4 characters.");
      form.reportValidity();
      return;
    }
    const post = posts.find(function (item) { return item.id === form.dataset.postId; });
    if (!post) return;
    const comments = getComments();
    const list = Array.isArray(comments[post.id]) ? comments[post.id] : [];
    list.push({
      name: name.slice(0, 48),
      initials: name.split(/\s+/).slice(0, 2).map(function (part) { return part[0]; }).join("").toUpperCase(),
      body: body.slice(0, 1200),
      date: new Date().toISOString().slice(0, 10),
      dateLabel: "Just now"
    });
    comments[post.id] = list;
    if (!writeStorage(storageKeys.comments, comments)) return;
    form.reset();
    const count = document.querySelector("[data-comment-count]");
    const commentList = document.querySelector("[data-comment-list]");
    const actionCount = document.querySelector(".detail-action-meta a");
    if (count) count.textContent = list.length + (list.length === 1 ? " note" : " notes");
    if (commentList) commentList.innerHTML = renderCommentItems(post);
    if (actionCount) actionCount.textContent = list.length + " comments ↓";
    showToast("Your note has been added. Thanks for joining in.");
  }

  function onLikeClick(event) {
    const button = event.target.closest("[data-like-button]");
    if (!button) return;
    const post = posts.find(function (item) { return item.id === button.dataset.postId; });
    if (!post) return;
    const ids = getLikedIds();
    const liked = ids.includes(post.id);
    const nextIds = liked ? ids.filter(function (id) { return id !== post.id; }) : ids.concat(post.id);
    if (!writeStorage(storageKeys.likes, nextIds)) return;
    button.setAttribute("aria-pressed", String(!liked));
    button.setAttribute("aria-label", liked ? "Like this story" : "Unlike this story");
    button.querySelector(".like-icon").textContent = liked ? "♡" : "♥";
    button.querySelector("[data-like-count]").textContent = getLikeCount(post) + " appreciations";
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.querySelector("[data-theme-icon]").textContent = dark ? "☀" : "☾";
    }
  }

  function onClick(event) {
    const navigationLink = event.target.closest("[data-navigation] a");
    if (navigationLink) {
      document.querySelector("[data-navigation]").classList.remove("is-open");
      document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", "false");
      document.querySelector("[data-menu-toggle]").setAttribute("aria-label", "Open navigation");
    }
    const filter = event.target.closest("[data-media-filter]");
    if (filter) {
      activeMediaFilter = filter.dataset.mediaFilter;
      render();
      return;
    }
    const toggle = event.target.closest("[data-theme-toggle]");
    if (toggle) {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (writeStorage(storageKeys.theme, next)) applyTheme(next);
      return;
    }
    const menu = event.target.closest("[data-menu-toggle]");
    if (menu) {
      const navigation = document.querySelector("[data-navigation]");
      const isOpen = navigation.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      return;
    }
    const searchForm = event.target.closest("[data-search-form]");
    if (searchForm && event.target.tagName !== "INPUT") {
      event.preventDefault();
      searchForm.querySelector("input").focus();
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("submit", function (event) {
    if (event.target.matches("[data-search-form]")) onSearchSubmit(event);
    if (event.target.matches("[data-comment-form]")) onCommentSubmit(event);
  });
  document.addEventListener("click", onLikeClick);
  window.addEventListener("hashchange", function () {
    document.querySelector("[data-navigation]").classList.remove("is-open");
    document.querySelector("[data-menu-toggle]").setAttribute("aria-expanded", "false");
    document.querySelector("[data-menu-toggle]").setAttribute("aria-label", "Open navigation");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      event.preventDefault();
      document.querySelector("#header-search-input").focus();
    }
    if (event.key === "Escape") {
      const navigation = document.querySelector("[data-navigation]");
      const menu = document.querySelector("[data-menu-toggle]");
      if (navigation.classList.contains("is-open")) {
        navigation.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
        menu.focus();
      }
    }
  });

  const savedTheme = readStorage(storageKeys.theme, "light");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  render();
})();
