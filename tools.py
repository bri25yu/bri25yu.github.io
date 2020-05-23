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
        return not (path[-4:].lower() == '.pdf' or PathHelper.get_filename(path) == 'index')

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
        path, _ = os.path.splitext(path)
        return os.path.split(path)[1]

    @staticmethod
    def get_nav_bar(path):
        nav_bar, path_to_now = '%s [Main menu](%s) | ' % (ih.get_home(path), BASE_URL), ''
        for step in PathHelper.split(path):
            path_to_now = os.path.join(path_to_now, step)
            nav_bar += PathHelper.get_icon_filename(path_to_now, path) + ' > '
        return nav_bar + '\n\n'

    @staticmethod
    def get_icon_filename(path, output_path=None):
        if output_path is None: output_path = path
        image = ih.get_file(output_path) if os.path.isfile(path) else ih.get_folder(output_path)
        name = PathHelper.get_filename(path)
        return '%s <a href="%s">%s</a>' % (image, PathHelper.get_link(path), name)

class ImageHelper:
    IMAGE_TEMPLATE = '![Alt text](%s "%s")'
    IMAGE_CUSTOM_SIZE_TEMPLATE = '<img src="%s" alt="%s" %s%stitle="%s">'

    def __init__(self):
        self.images = {}
        for img_path in os.listdir(IMAGE_DIR):
            img_name = os.path.splitext(img_path)[0]
            self.images[img_name] = os.path.join(IMAGE_DIR, img_path)

    def get(self, image_name, output_path, image_text=None, image_width=None, image_height=None):
        if os.path.isfile(output_path): output_path = os.path.split(output_path)[0]
        image_path = os.path.relpath(self.images.get(image_name, self.images.get('missing')), output_path)
        if image_text is None: image_text = image_name

        if image_width is None and image_height is None:
            return ImageHelper.IMAGE_TEMPLATE % (image_path, image_text)

        image_width = 'width="%s" ' % image_width if image_width is not None else ''
        image_height = 'height="%s" ' % image_height if image_height is not None else ''
        return ImageHelper.IMAGE_CUSTOM_SIZE_TEMPLATE % (image_path, image_text, image_width, image_height, image_text)

    def get_folder(self, output_path):
        return self.get('folder', output_path, image_width=12, image_height=12)

    def get_file(self, output_path):
        return self.get('file', output_path, image_width=12, image_height=12)

    def get_home(self, output_path):
        return self.get('home', output_path, image_width=12, image_height=12)

ih = ImageHelper()
