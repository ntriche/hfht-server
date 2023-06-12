# hfht's web server #
## Description

A NodeJS and [Nest](https://github.com/nestjs/nest)-based server meant to service my website, located at [hfht.moe](https://hfht.moe). The Github page for the website is located [here](https://github.com/ntriche/hfht-website). 

This server is responsible for authenticating users (i.e., myself), receiving and automatically filtering posts from the website, allowing authenticated users to access the dashboard on the website to manually filter posts, queuing approved posts, and interacting with the Tumblr API to create posts.. 

This project is under active development.

## Installation & Such

Install as usual

```bash
$ npm install
```

This project is configured for hot reload, so the preferred method of starting is as follows:

```bash
$ npm run start:dev
```