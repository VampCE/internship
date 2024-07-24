#!/bin/bash



sleep 5

#
# Send reply
#
cat srv_reply | nc localhost 61001

touch /tmp/srv_restart
