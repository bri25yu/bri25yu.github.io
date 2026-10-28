# Contributing

This site uses Jekyll with the GitHub Pages Merlot theme. Preview changes locally before publishing them.

## One-time setup on macOS

1. Install Ruby 3.3 using [Homebrew](https://formulae.brew.sh/formula/ruby@3.3):

   ```sh
   brew install ruby@3.3
   export PATH="$(brew --prefix ruby@3.3)/bin:$PATH"
   ```

   Add the `export` line to `~/.zshrc` to use this Ruby installation in new terminals.

2. Open a terminal in your checkout of this repository:

   ```sh
   cd /path/to/bri25yu.github.io
   ```

3. If the repository does not already have a `Gemfile`, create one in its root with:

   ```ruby
   source "https://rubygems.org"

   gem "github-pages", group: :jekyll_plugins
   gem "webrick"
   ```

4. Install the dependencies:

   ```sh
   bundle install
   ```

## Preview locally

From the repository root, run:

```sh
bundle exec jekyll serve --livereload
```

Open [http://localhost:4000](http://localhost:4000) in your browser. The existing blog page is available at [http://localhost:4000/blog/prerequisites-for-nemo-gym-infra-development.html](http://localhost:4000/blog/prerequisites-for-nemo-gym-infra-development.html).

Edits to pages and styles automatically rebuild the site and refresh the browser. Restart the server after changing `_config.yml`. Press **Ctrl+C** to stop the server.

## Build without serving

```sh
bundle exec jekyll build
```

The generated site is written to `_site/`. Do not commit this generated directory.

For more information, see [GitHub's guide to testing a Jekyll site locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll).
