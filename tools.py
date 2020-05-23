"""
@author bri25yu
"""

import os

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

