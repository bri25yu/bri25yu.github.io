"""
@author bri25yu
"""

import os

def main():
    # process_language_readings()
    pass

def apply_to_dir(root, file_fn=None, dir_fn=None):
    queue = [root]
    while queue:
        curr = queue.pop(0)
        if os.path.exists(curr):
            if file_fn is not None and os.path.isfile(curr): file_fn(curr)
            elif os.path.isdir(curr) and (dir_fn is None or dir_fn(curr)):
                queue.extend([os.path.join(curr, name) for name in os.listdir(curr)])

def process_language_readings():
    language_dir = './Language'
    def file_fn(path):
        open(path[:-3] + 'md', 'a').close()
    apply_to_dir(language_dir, file_fn=file_fn)

if __name__ == '__main__':
    main()
