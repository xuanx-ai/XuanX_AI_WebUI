// Shared content for all three variations.
// Bilingual fields end in _en / _zh.

const META = {
  group_en: 'xuanx ai',
  group_zh: 'xuanx 实验室',
  tagline_en: 'The gateway to the formless',
  tagline_zh: '众妙之门',
  manifesto_en: [
    'xuanx is an independent group writing about, prototyping, and shipping',
    'tools for working with language models. we believe in legible systems,',
    'small abstractions, and the boring parts of AI — evals, latency, and the',
    'shape of a good text editor.',
  ],
  manifesto_zh: [
    'xuanx 是一个独立的小组，写文章、做原型、发布与语言模型相关的工具。',
    '我们相信可读的系统、克制的抽象，以及 AI 中"无趣"的部分——评测、延迟、',
    '一个好的文本编辑器应当长什么样。',
  ],
  contact: 'admin@xuanx.ai',
  github: 'https://github.com/xuanx-ai',
  rss: '/feed.xml',
  shellUser: 'admin',
  shellHost: 'xuanx.ai',
};

// Topics are the broad subject areas. Tags are the post format.
// A post can belong to one topic and carry multiple tags.
const TOPICS = [
  { id: 'all',     en: 'all',     zh: '全部'   },
  { id: 'vision',  en: 'vision',  zh: '愿景'   },
];

// Posts. Each post stores its full body in markdown for both languages.
// To add a new post, append an entry and (optionally) push it to the top
// of the array so it surfaces as the "latest" pull-quote on the homepage.
const POSTS = [
  {
    slug: 'mission-and-worldview',
    date: '2026-05-17',
    topic: 'vision',
    tags: ['manifesto'],
    author: 'xuanx',
    reading: 8,
    title_en: 'Mission & Worldview',
    title_zh: '使命与世界观',
    excerpt_en: 'What does it mean for knowledge to exist in a form that can be explored, but never fully fixed?',
    excerpt_zh: '知识以一种既可探索、又无法被完全固定的形式存在，这意味着什么？',
    body_en: `# xuanx.ai — Mission & Worldview

## Introduction

xuanx.ai is an exploration of how knowledge can be expressed, transformed, and revisited across forms.

We are not building a system that simply produces answers. We are interested in a more fundamental question: how understanding itself takes shape when knowledge is no longer confined to a single representation.

Our guiding question is simple, but unresolved:

> What does it mean for knowledge to exist in a form that can be explored, but never fully fixed?

## Mission

**To make the unseen structure of knowledge computable and explorable.**

We aim to build systems that can represent complex knowledge in computable forms, explore how knowledge behaves across contexts, and support the continuous evolution of those representations over time.

Our focus is not limited to understanding, nor to generation alone. What interests us is the broader problem of how knowledge can be expressed, transformed, and made usable across different forms.

## Worldview

### 1. Knowledge is neither purely structure nor purely flow

We do not assume knowledge is inherently structured, nor do we view it as purely probabilistic generation.

Knowledge can appear as explicit structure—schemas, graphs, models—or as dynamic flow through context, emergence, and generation. More often, it exists somewhere between the two.

A knowledge system is therefore not defined by a fixed representation, but by its ability to move between representations without losing practical meaning.

### 2. Full interpretability is not the only valid form of intelligence

Modern AI systems, especially parameterized models, challenge the assumption that all useful knowledge must be explicitly representable.

Some knowledge remains implicit. Some cannot be cleanly extracted. Some exists as operational capability rather than symbolic structure.

This does not make it less useful.

What matters is whether knowledge can be extended, transferred, and applied under changing constraints—not whether every internal state can be perfectly explained.

### 3. Intelligence is closely tied to representational transformation

Rather than asking what knowledge *is*, we are more interested in what knowledge *does* across forms.

How does implicit knowledge become explicit?
How does structured knowledge become generative?
How does meaning survive movement between contexts?

These transitions are not implementation details. They are central to intelligence itself.

### 4. The unknown is not missing information

We do not treat the unknown as a simple absence of knowledge.

In many cases, the unknown is better understood as space that has not yet been structured, modeled, or expressed in usable form.

Exploration, in this sense, is not merely retrieval. It is the expansion of what can become representable.

### 5. We are not looking for a final representation of intelligence

We do not assume there is a single optimal representation of knowledge, or a final unified model toward which intelligence converges.

Different forms of representation expose different capabilities, constraints, and modes of reasoning.

What matters is not fixing knowledge into one canonical structure, but preserving the ability to continuously reinterpret and operationalize it as contexts change.

## Closing

We do not seek to define the final form of intelligence.

We seek to understand how intelligence changes form.

xuanx.ai is not an attempt to fix meaning.

It is a gateway:

> to the formless, and to everything that continues to emerge from it.`,
    body_zh: `# xuanx.ai — 使命与世界观

## 引言

xuanx.ai 是一次关于知识如何被表达、转化，并在不同形式之间被重新理解的探索。

我们并不只是想构建一个生成答案的系统。相比"回答问题"，我们更关心一个更基础的问题：当知识不再被限定在某一种固定表达形式中时，"理解"本身是如何形成的。

我们的核心问题很简单，但至今没有明确答案：

> 知识以一种既可探索、又无法被完全固定的形式存在，这意味着什么？

## 使命

**让不可见的知识结构变得可计算、可探索。**

我们希望构建的系统，能够将复杂知识转化为可计算的表达形式，探索知识在不同语境中的行为方式，并支持这些表达形式随着问题与场景持续演化。

我们关注的，不只是理解，也不只是生成，而是知识如何在不同形式之间被表达、转化，并持续保持可用性。

## 世界观

### 1. 知识既不是纯结构，也不是纯流动

我们不认为知识天然就是结构化的，也不认为它只是概率意义上的生成流。

知识有时表现为明确结构，例如 schema、graph、model；有时表现为上下文中的动态生成，例如 context、emergence、generation。更多时候，它存在于两者之间，并不断发生转换。

因此，一个知识系统的核心，不在于它采用哪一种固定表示，而在于它能否在不同表示之间转换，同时保持意义与可用性。

### 2. 完全可解释，并不是智能的唯一形式

现代 AI，尤其是参数化模型，已经让"知识必须被显式表示"这个假设变得不再成立。

有些知识是隐式存在的，有些知识无法被完整提取出来，有些知识本身更接近一种可操作能力，而不是明确的符号结构。

这并不意味着它没有价值。

真正重要的问题是：这些知识能否在新的约束和场景下被扩展、迁移和应用，而不是我们是否能够完整解释系统内部的每一个状态。

### 3. 智能与知识表达形式之间的转换能力高度相关

比起追问"知识是什么"，我们更关心知识在不同形式之间如何变化。

隐式知识如何变成显式知识？
结构化知识如何转化为生成能力？
知识在跨语境迁移时，意义如何保持连续？

这些并不是实现层面的技术细节，而是智能本身的重要组成部分。

### 4. 未知不等于信息缺失

我们不把未知简单理解为"还没有答案"。

很多时候，未知更像是尚未被结构化、尚未被建模、或者尚未形成可用表达方式的空间。

因此，探索未知并不只是检索已有信息，而是在扩展系统能够理解和表达的问题边界。

### 5. 我们不追求终极模型

我们不假设知识最终会收敛为一种统一表示，也不认为存在某种唯一最优的智能表达方式。

不同的表示形式会暴露出不同的能力边界、推理模式与适用约束。

相比寻找一个"最终答案"，我们更关心如何让知识在环境变化时，持续被重新组织、重新理解，并继续发挥作用。

## 结语

我们不试图定义智能的最终形态。

我们试图理解，智能如何不断改变自己的表达形式。

xuanx.ai 并不是在试图固定意义。

它是一扇门：

> 通向无形，以及从无形之中持续生成的一切。`,
  },
];

const PROJECTS = [
  { name: 'inkwell',        desc_en: 'markdown-first writing surface for LLM drafts',  desc_zh: '面向 LLM 草稿的 markdown 写作工具',   stars: 1284, lang: 'TypeScript', license: 'MIT' },
  { name: 'spool',          desc_en: 'CLI for batched LLM evals against OpenAI compat', desc_zh: '兼容 OpenAI 接口的批量评测命令行',    stars: 412,  lang: 'Python',     license: 'Apache-2.0' },
  { name: 'whisper-stream', desc_en: 'real-time WebRTC transcription, server + edge',   desc_zh: '实时 WebRTC 转写，服务端 + 边缘',     stars: 856,  lang: 'Rust',       license: 'MIT' },
  { name: 'atlas',          desc_en: 'interpretability viewer for small models',        desc_zh: '小模型的可解释性查看器',              stars: 203,  lang: 'TypeScript', license: 'MIT' },
];

// Prototypes — add entries here as you publish them. The page renders an
// empty state automatically when this array is empty.
const PROTOTYPES = [
  // Example entry (uncomment & edit when you have one to publish):
  // { name: 'conversation-graph', tag: 'WIP', url: 'https://...', desc_en: 'chats as a navigable DAG, not a linear scroll', desc_zh: '把对话视为可导航的有向图，而非线性滚动' },
];

const CHANGELOG = [
  { date: '2026-05-15', kind: 'release', text_en: 'inkwell v0.4 — inline AI insertions',         text_zh: 'inkwell v0.4 — 行内 AI 插入' },
  { date: '2026-05-04', kind: 'release', text_en: 'spool 0.9 supports the OpenAI batch API',     text_zh: 'spool 0.9 支持 OpenAI batch API' },
  { date: '2026-04-28', kind: 'build',   text_en: 'whisper-stream now has a WASM build',         text_zh: 'whisper-stream 新增 WASM 构建' },
  { date: '2026-04-19', kind: 'post',    text_en: 'three new essays in the Notes section',      text_zh: '《笔记》区新发三篇文章' },
];

const SECTIONS = [
  { id: 'home',       en: 'home',       zh: '首页' },
  { id: 'blog',       en: 'blog',       zh: '博客' },
  { id: 'prototypes', en: 'prototypes', zh: '原型' },
  { id: 'projects',   en: 'projects',   zh: '项目' },
  { id: 'changelog',  en: 'changelog',  zh: '动态' },
  { id: 'about',      en: 'about',      zh: '关于' },
  { id: 'contact',    en: 'contact',    zh: '联系' },
];

const ABOUT = {
  en: [
    'xuanx.ai is a small research and engineering group working on the',
    'representation of knowledge — how it can be expressed in computable',
    'forms, how it moves between those forms, and what remains usable',
    'when the form changes.',
    '',
    'We are not building a system that produces answers. We are interested',
    "in a question that comes earlier: how understanding takes shape when",
    'knowledge is no longer confined to a single representation.',
    '',
    'We treat structure and generation as endpoints of the same surface,',
    'not as opposing camps. Knowledge sometimes appears as a schema, a',
    "graph, a parameterized model; sometimes as flow through context.",
    'What matters is whether it can be moved between those modes without',
    'losing meaning.',
    '',
    'Our work shows up here as writing, prototypes, and open-source tools.',
    'It is a gateway — to the formless, and to what continues to emerge',
    'from it.',
  ],
  zh: [
    'xuanx.ai 是一个小型的研究与工程小组，关注知识的表达——',
    '它如何以可计算的形式存在，如何在不同形式之间移动，',
    '以及当形式改变时，意义是否仍然可用。',
    '',
    '我们并不只是在做一个生成答案的系统。',
    '我们关心的是更早一步的问题：当知识不再被限定在某一种固定表达形式中时，',
    '"理解"是如何形成的。',
    '',
    '我们不把"结构"与"生成"视为对立两极，而是同一个表面上的两端。',
    '知识有时表现为 schema、graph、参数化模型；有时表现为上下文中的流动。',
    '真正重要的是：它能否在不同形式之间被转换，而不丢失意义。',
    '',
    '我们的工作以文章、原型与开源工具的形式出现在这里。',
    '它是一扇门——通向无形，以及从无形之中持续生成的一切。',
  ],
};

// "Now" panel — shown on the homepage. Edit these to keep the front page
// fresh; they read as a snapshot of what we're paying attention to.
const NOW = [
  { en: 'reading: the Mission & Worldview essay (new)',  zh: '在读：Mission & Worldview 这一篇（新）' },
  { en: 'building: tools for representing knowledge',     zh: '在做：知识表达相关的工具' },
  { en: 'open to: conversations, not pitches',            zh: '欢迎：对话，而不是 pitch' },
];

Object.assign(window, { META, POSTS, PROJECTS, PROTOTYPES, CHANGELOG, SECTIONS, ABOUT, NOW, TOPICS });
