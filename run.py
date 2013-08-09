from staticjinja import Renderer


if __name__ == "__main__":
    renderer = Renderer(outpath='./output')
    renderer.run(debug=True, use_reloader=True)
