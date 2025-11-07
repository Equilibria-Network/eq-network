import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/about',
    component: ComponentCreator('/about', 'c49'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '100'),
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
    component: ComponentCreator('/blog/tags/collective-intelligence', '99e'),
    exact: true
  },
  {
    path: '/blog/tags/complexity',
    component: ComponentCreator('/blog/tags/complexity', '250'),
    exact: true
  },
  {
    path: '/blog/tags/simulation',
    component: ComponentCreator('/blog/tags/simulation', '027'),
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
    path: '/roadmap',
    component: ComponentCreator('/roadmap', '274'),
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
