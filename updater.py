#!/usr/bin/env python

import sys
import time
import os
import subprocess

os.chdir(os.path.dirname(os.path.abspath(__file__)))


current_version = subprocess.check_output(['git', 'rev-parse', 'HEAD'])

while True:
    print "Checking...", time.asctime()
    sys.stdout.flush()
    subprocess.check_output(['git', 'pull', 'origin', 'master'])
    new_version = subprocess.check_output(['git', 'rev-parse', 'HEAD'])
    if new_version != current_version:
        print "Change detected (%s -> %s). Compiling" % (current_version, new_version),time.asctime()
        sys.stdout.flush()
        current_version = new_version
        subprocess.Popen([sys.executable, 'run.py', '--dont-stop'])

    time.sleep(30)
