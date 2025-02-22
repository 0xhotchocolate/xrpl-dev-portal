// @ts-check

import { getInnerText } from '@redocly/realm/dist/shared/markdoc.js';

import { dirname, relative, join as joinPath } from 'path';
import markdoc from '@markdoc/markdoc';
import moment from "moment";

export function blogPosts() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    processContent: async (contentProvider, actions) => {
      try {
        const posts = [];
        const allBlogFiles = Array.from(contentProvider.fsFilesList.values());

        const markdownFiles = allBlogFiles.filter(file => file.match(/blog[\/\\]([^\\\/]*)[\/\\].*\.md$/));

        for (const relativePath of markdownFiles) {
          const record = contentProvider.loadContent(relativePath, 'frontmatter');
          const ast = markdoc.parse(record.content);

          const dirPath = dirname(relativePath);
          const title = extractFirstHeading(ast) || '';
          const category = extractCategory(record.parsed.data.labels);
          const year = `${relativePath.split("/")[1]}`

          posts.push({
            path: dirPath,
            author: record.parsed.data.author || "",
            title: title || toTitleCase(dirname(dirPath)),
            description: getInnerText([ast.children[1]]).replace(title, '').trim(),
            year: year,
            date: record.parsed.data.date
                    ? moment(record.parsed.data.date).format("YYYY-MM-DD")
                    : moment(year).format("YYYY-MM-DD"),
            category: category || "General",
            category_id: category ? category.toLowerCase().replace(/ /g, "_") : "general",
            link: `${relativePath.replace('blog/', '').replace(".md", "")}`,
          });
        }

        const sortedPosts = sortBlogPostsByDate(posts)

        actions.createSharedData('blog-posts', { blogPosts: sortedPosts });
        actions.addRouteSharedData('/blog/', 'blog-posts', 'blog-posts');
      } catch (e) {
        console.log(e);
      }
    },
  };
  return instance;
}

function extractCategory(labelsFrontmatter) {
  const categories = [];
  for (const i in labelsFrontmatter) {
    if (labelsFrontmatter[i].includes("Release")) {
      labelsFrontmatter[i] = "Release Notes"
    }
    categories.push(labelsFrontmatter[i]);
  }
  // We only need the first category from the frontmatter.
  return categories[0];
}

function sortBlogPostsByDate(posts) {
  const sortedItems = posts.sort((a, b) => {
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);

    // Sort in descending order
    return dateB.getTime() - dateA.getTime();
  });
  return sortedItems;
}

const WORDS_TO_CAPS = ['xrp'];

function toTitleCase(s) {
  const words = s.split(/_|[^\w']/);
  return words
    .filter(word => word)
    .map(word => (WORDS_TO_CAPS.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
    .replace("'S", "'s")
    .replace(' A ', ' a ');
}

function unique(array) {
  return Array.from(new Set(array));
}

function extractFirstHeading(ast) {
  let heading;

  visit(ast, node => {
    if (!isNode(node)) {
      return;
    }

    if (node.type === 'heading') {
      heading = getInnerText([node]);
      return EXIT;
    }
  });

  return heading;
}

function isNode(value) {
  return !!(value?.$$mdtype === 'Node');
}

const EXIT = Symbol('Exit visitor');
function visit(node, visitor) {
  if (!node) return;

  const res = visitor(node);
  if (res === EXIT) return res;

  for (const child of node.children) {
    if (!child || typeof child === 'string') {
      continue;
    }
    const res = visit(child, visitor);
    if (res === EXIT) return res;
  }
}

