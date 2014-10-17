import os
from jinja2 import Environment

import markdown
import mdx_smartypants

from staticjinja import Renderer
from optparse import OptionParser



def markdown_filter(source):
    """
    Markdown filter for Jinja2.
    :param source: Source in markdown format
    :return: Markdown rendered HTML.
    """
    return markdown.markdown(source, extensions=[mdx_smartypants.makeExtension({"entities":"named"})])

def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
    return value.strftime(format)


if __name__ == "__main__":
    parser = OptionParser()
    parser.add_option("-s", "--dont-stop", dest="dont_stop",
                    help="Don't stop for reloading", action='store_true', default=False)
    (options, args) = parser.parse_args()

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

    renderer = Renderer(outpath='./output', rules = [ ('.*.tmp', dont_render), ('.*.swx', dont_render) ])
    renderer._env.filters["markdown"] = markdown_filter
    renderer._env.filters['datetimeformat'] = datetimeformat
    renderer.filter_func = filter_func


    renderer.run(debug=True, use_reloader = not options.dont_stop)
