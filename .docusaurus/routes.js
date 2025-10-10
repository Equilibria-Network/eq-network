import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/about',
    component: ComponentCreator('/about', 'c49'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'e3c'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '1df'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/collective-intelligence',
    component: ComponentCreator('/blog/tags/collective-intelligence', 'd5f'),
    exact: true
  },
  {
    path: '/blog/tags/complexity',
    component: ComponentCreator('/blog/tags/complexity', '65a'),
    exact: true
  },
  {
    path: '/blog/tags/simulation',
    component: ComponentCreator('/blog/tags/simulation', '3f2'),
    exact: true
  },
  {
    path: '/blog/toc-governance',
    component: ComponentCreator('/blog/toc-governance', '4b8'),
    exact: true
  },
  {
    path: '/blog/toc-mycorrhiza',
    component: ComponentCreator('/blog/toc-mycorrhiza', '65c'),
    exact: true
  },
  {
    path: '/faq',
    component: ComponentCreator('/faq', '194'),
    exact: true
  },
  {
    path: '/research',
    component: ComponentCreator('/research', 'e57'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
