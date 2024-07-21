#!/bin/bash

while true
do
        #
        # Listen for request
        #
        ncat -4 -e ./srv_process.sh -o /tmp/srv_request.$(date "+%Y%m%d%H%M%S") -l 61000

        while true
        do
                if [ -f /tmp/srv_restart ]
                then
                        rm -rf /tmp/srv_restart
                        break
                fi

                sleep 1
        done
done

