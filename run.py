import os
from staticjinja import Renderer


if __name__ == "__main__":
    def filter_func(filepath):
        filename = os.path.basename(filepath)
        if filename.startswith(('.', '_')):
            return False
        if not filename.endswith('.html'):
            return False
        return True

    def dont_render(*args, **kwargs):
        print "Rendering..."
        pass

    renderer = Renderer(outpath='./output', rules = [ ('.*.swp', dont_render) ])
    renderer.filter_func = filter_func
    renderer.run(debug=True, use_reloader=True)
