"""
@author bri25yu
"""

import os

from tools import DirectoryTraversals, PathHelper as ph

def main():
    def post_fn(curr):
        if os.path.isfile(curr) and ph.valid_index_path(curr):
            with open(curr, 'w') as file:
                file.write(ph.get_nav_bar(curr))
                file.write('Currently blank, please check back later!')
    DirectoryTraversals(post_fn=post_fn).BFS('Language')
    create_index_files('Language')
    create_toc('Language')

def process_language_readings():
    language_dir = './Language'
    def file_fn(path):
        if os.path.isfile(path): open(path[:-3] + 'md', 'a').close()

    DirectoryTraversals(post_fn=file_fn).BFS(language_dir)

def create_index_files(root):
    template = ' - [%s](%s)\n'
    def post_fn(curr):
        if not os.path.isdir(curr): return

        with open(os.path.join(curr, 'index.md'), 'w') as file:
            file.write(ph.get_nav_bar(curr))
            file.write(ph.get_filename(curr) + '\n')
            for child in os.listdir(curr):
                if ph.valid_index_path(child):
                    file.write(template % (child, ph.get_link(os.path.join(curr, child))))

    DirectoryTraversals(post_fn=post_fn).BFS(root)

def create_toc(root):
    template = '<summary>%s<a href="%s">%s</a></summary>\n'

    with open(os.path.join(root, '..', 'output.md'), 'w') as file:
        level = 0
        def pre_fn(curr):
            nonlocal level
            if ph.valid_index_path(curr):
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
