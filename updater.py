#!/usr/bin/env python

import sys
import time
import os
import subprocess
import traceback

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Don't execute a script from github so easily. Manually restart this process for that.
run_code = open("run.py").read()
open('/tmp/run.py', 'w').write(run_code)

current_version = subprocess.check_output(['git', 'rev-parse', 'HEAD'])

while True:
    time.sleep(30)
    sys.stderr.flush()
    print "Checking...", time.asctime()
    sys.stdout.flush()
    try:
        subprocess.check_output(['git', 'pull', 'origin', 'master'])
        new_version = subprocess.check_output(['git', 'rev-parse', 'HEAD'])
        if new_version != current_version:
            print "Change detected (%s -> %s). Compiling" % (current_version, new_version),time.asctime()
            sys.stdout.flush()
            current_version = new_version
            subprocess.Popen([sys.executable, '/tmp/run.py', '--dont-stop'])
    except:
        traceback.print_exc()
        continue

