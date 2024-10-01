#!/bin/bash

# Simple restart loop for the bot
while true; do
  npm start
  echo "Bot has exited. Restarting in 5 seconds..."
  sleep 5
done
