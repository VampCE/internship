#!/bin/bash

sleep 5

#
# Send reply
#
cat ./srv_reply > /dev/tcp/$NCAT_REMOTE_ADDR/61001

touch /tmp/srv_restart

