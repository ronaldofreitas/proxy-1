#!/bin/bash

pid=`ps -ef | grep PingService.js | awk -F" " '{print $2}'`

if ! kill $pid > /dev/null 2>&1; then
    echo "Could not send SIGTERM to process $pid" >&2
fi