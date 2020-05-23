"""
@author bri25yu
"""

import os

from tools import DirectoryTraversals, PathHelper as ph

def main():
    create_index_files('Language')

def process_language_readings():
    language_dir = './Language'
    def file_fn(path):
        if os.path.isfile(path): open(path[:-3] + 'md', 'a').close()

    DirectoryTraversals(post_fn=file_fn).BFS(language_dir)

def create_index_files(root):
    def post_fn(curr):
        if not os.path.isdir(curr): return

        with open(os.path.join(curr, 'index.md'), 'w') as file:
            pass

    DirectoryTraversals(post_fn=post_fn).BFS(root)

def create_toc(root):
    template = '<summary>%s<a href="%s">%s</a></summary>\n'

    with open(os.path.join(root, '..', 'output.md'), 'w') as file:
        level = 0
        def pre_fn(curr):
            nonlocal level
            if not curr[-4:].lower() == '.pdf':
                if os.path.isdir(curr): file.write('<details>\n')
                prepend = '' if level == 0 else '&nbsp;' * 4 * (level + os.path.isfile(curr))
                file.write(template % (prepend, ph.get_link(curr), ph.get_filename(curr)))
            level += 1

        def post_fn(curr):
            nonlocal level
            if os.path.isdir(curr): file.write('</details>\n')
            level -= 1

        DirectoryTraversals(pre_fn=pre_fn, post_fn=post_fn).DFS(root)

if __name__ == '__main__':
    main()
