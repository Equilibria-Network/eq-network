import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/eq-network/__docusaurus/debug',
    component: ComponentCreator('/eq-network/__docusaurus/debug', '749'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/config',
    component: ComponentCreator('/eq-network/__docusaurus/debug/config', '9da'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/content',
    component: ComponentCreator('/eq-network/__docusaurus/debug/content', '6fd'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/globalData',
    component: ComponentCreator('/eq-network/__docusaurus/debug/globalData', '910'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/metadata',
    component: ComponentCreator('/eq-network/__docusaurus/debug/metadata', 'f8d'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/registry',
    component: ComponentCreator('/eq-network/__docusaurus/debug/registry', '619'),
    exact: true
  },
  {
    path: '/eq-network/__docusaurus/debug/routes',
    component: ComponentCreator('/eq-network/__docusaurus/debug/routes', 'e09'),
    exact: true
  },
  {
    path: '/eq-network/about',
    component: ComponentCreator('/eq-network/about', '801'),
    exact: true
  },
  {
    path: '/eq-network/blog',
    component: ComponentCreator('/eq-network/blog', 'b21'),
    exact: true
  },
  {
    path: '/eq-network/blog/archive',
    component: ComponentCreator('/eq-network/blog/archive', '671'),
    exact: true
  },
  {
    path: '/eq-network/blog/authors',
    component: ComponentCreator('/eq-network/blog/authors', '316'),
    exact: true
  },
  {
    path: '/eq-network/blog/collective-intelligence',
    component: ComponentCreator('/eq-network/blog/collective-intelligence', '0a3'),
    exact: true
  },
  {
    path: '/eq-network/blog/network-theory',
    component: ComponentCreator('/eq-network/blog/network-theory', 'a2b'),
    exact: true
  },
  {
    path: '/eq-network/blog/tags',
    component: ComponentCreator('/eq-network/blog/tags', '05d'),
    exact: true
  },
  {
    path: '/eq-network/blog/tags/collective',
    component: ComponentCreator('/eq-network/blog/tags/collective', '5bb'),
    exact: true
  },
  {
    path: '/eq-network/blog/tags/intelligence',
    component: ComponentCreator('/eq-network/blog/tags/intelligence', '750'),
    exact: true
  },
  {
    path: '/eq-network/blog/tags/network',
    component: ComponentCreator('/eq-network/blog/tags/network', '1e1'),
    exact: true
  },
  {
    path: '/eq-network/contact',
    component: ComponentCreator('/eq-network/contact', '219'),
    exact: true
  },
  {
    path: '/eq-network/',
    component: ComponentCreator('/eq-network/', 'a48'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
