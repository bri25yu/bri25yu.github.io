"""
@author bri25yu
"""

import os

from settings import TOC_DIR
from tools import DirectoryTraversals, PathHelper as ph

def main():
    pass

def process_language_readings():
    language_dir = './Language'
    def file_fn(path):
        if os.path.isfile(path): open(path[:-3] + 'md', 'w').close()

    DirectoryTraversals(post_fn=file_fn).BFS(language_dir)

    initialize_md_files('Language')
    create_index_files('Language')
    create_toc('Language')

def process_berkeley():
    temp = DirectoryTraversals.TIEBREAK_FN
    def tiebreak_fn(l):
        key_fn = lambda s: s
        sems = {'sp' : '0', 'su' : '1', 'fa' : '2'}
        names = [ph.get_filename(s) for s in l if ph.valid_index_path(s)]
        if all(map(lambda s: len(s) == 4 and s[:2] in sems, names)):
            key_fn = lambda s: s[-2:] + sems.get(s[-4:-2], '9')
        return sorted(l, key=key_fn)
    initialize_md_files('Berkeley')
    create_index_files('Berkeley')
    DirectoryTraversals.TIEBREAK_FN = tiebreak_fn
    create_toc('Berkeley')
    DirectoryTraversals.TIEBREAK_FN = temp

def initialize_md_files(root):
    def post_fn(curr):
        if os.path.isfile(curr) and ph.valid_index_path(curr):
            with open(curr, 'w') as file:
                file.write(ph.get_nav_bar(curr))
                file.write('Currently blank, please check back later!')
    DirectoryTraversals(post_fn=post_fn).BFS(root)

def create_index_files(root):
    template = ' - %s\n'
    def post_fn(curr):
        if not os.path.isdir(curr): return

        with open(os.path.join(curr, 'index.md'), 'w') as file:
            file.write(ph.get_nav_bar(curr))
            file.write(ph.get_icon_filename(curr, curr) + '\n')
            for child in os.listdir(curr):
                if ph.valid_index_path(child):
                    file.write(template % (ph.get_icon_filename(os.path.join(curr, child), curr)))

    DirectoryTraversals(post_fn=post_fn).BFS(root)

def create_toc(root):
    template = '<summary>%s%s</summary>\n'

    with open(os.path.join(TOC_DIR, root + '.md'), 'w') as file:
        level = 0
        def pre_fn(curr):
            nonlocal level
            if ph.valid_index_path(curr):
                if os.path.isdir(curr): file.write('<details>\n')
                prepend = '' if level == 0 else '&nbsp;' * 4 * (level + os.path.isfile(curr))
                file.write(template % (prepend, ph.get_icon_filename(curr, '')))
            level += 1

        def post_fn(curr):
            nonlocal level
            if os.path.isdir(curr): file.write('</details>\n')
            level -= 1

        DirectoryTraversals(pre_fn=pre_fn, post_fn=post_fn).DFS(root)

    toc_ref_template = '<zero-md src="%s.md"></zero-md>\n'
    toc_ref = toc_ref_template % root
    with open(os.path.join(TOC_DIR, 'toc.md')) as file:
        found = False
        for line in file:
            if toc_ref in line:
                found = True
                break
    with open(os.path.join(TOC_DIR, 'toc.md'), 'a') as file:
        if not found: file.write(toc_ref)

if __name__ == '__main__':
    main()
