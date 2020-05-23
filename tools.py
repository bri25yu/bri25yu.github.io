"""
@author bri25yu
"""

import os
from urllib.parse import quote

from settings import *

class DirectoryTraversals:
    """
    Traversals for directories, as a subset of Directed Acyclic Graphs (DAGs). 
    """
    PRE_FN = lambda n: None
    POST_FN = lambda n: None
    TIEBREAK_FN = lambda l: sorted(l)

    @staticmethod
    def CHILD_FN(curr):
        if os.path.isfile(curr): return []
        return [os.path.join(curr, name) for name in os.listdir(curr)]

    def __init__(self, **kwargs):
        self.pre_fn = kwargs.get('pre_fn', DirectoryTraversals.PRE_FN)
        self.post_fn = kwargs.get('post_fn', DirectoryTraversals.POST_FN)
        self.tiebreak_fn = kwargs.get('tiebreak_fn', DirectoryTraversals.TIEBREAK_FN)
        self.child_fn = kwargs.get('child_fn', DirectoryTraversals.CHILD_FN)

    def BFS(self, root):
        queue = [root]
        while queue:
            curr = queue.pop(0)
            self.post_fn(curr)
            for child in self.tiebreak_fn(self.child_fn(curr)):
                self.pre_fn(child)
                queue.append(child)

    def DFS(self, root):
        """
        Recursively implemented, not suitable for large filesystems.
        """
        self.pre_fn(root)
        for child in self.tiebreak_fn(self.child_fn(root)):
            self.DFS(child)
        self.post_fn(root)

class PathHelper:

    @staticmethod
    def valid_index_path(path):
        return not (path[-4:].lower() == '.pdf' or PathHelper.get_filename(path) == 'index.md')

    @staticmethod
    def split(path):
        return path.split('\\')

    @staticmethod
    def get_link(path):
        relative_url = '/'.join(PathHelper.split(path))
        if relative_url.endswith('.md'): relative_url = relative_url[:-2] + 'html'
        return BASE_URL + quote(relative_url)

    @staticmethod
    def get_filename(path):
        return os.path.split(path)[1]

    @staticmethod
    def get_nav_bar(path):
        nav_bar, path_to_now = '', ''
        for step in PathHelper.split(path):
            path_to_now = os.path.join(path_to_now, step)
            nav_bar += '[%s](%s) > ' % (step, PathHelper.get_link(path_to_now))
        return nav_bar + '\n\n'
