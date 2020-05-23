"""
@author bri25yu
"""

import os
from urllib.parse import quote

from tools import DirectoryTraversals

base_url = 'https://bri25yu.github.io/'

def main():
    pass

def process_language_readings():
    language_dir = './Language'
    def file_fn(path):
        if os.path.isfile(path): open(path[:-3] + 'md', 'a').close()

    DirectoryTraversals(post_fn=file_fn).BFS(language_dir)

def create_index_files(root):
    pass

def create_toc(root):
    with open(os.path.join(root, '..', 'output.md'), 'a') as file:
        level = 0
        def pre_fn(curr):
            nonlocal level
            if not curr.endswith('.pdf'):
                filename = curr.split('\\')[-1]
                prepend = '' if level == 0 else ' ' * 4 * (level - 1) + ' - '
                link = quote(base_url + curr)
                file.write('%s[%s](%s)\n' % (prepend, filename, link))
            level += 1

        def post_fn(curr):
            nonlocal level
            level -= 1

        DirectoryTraversals(pre_fn=pre_fn, post_fn=post_fn).DFS(root)

if __name__ == '__main__':
    main()
