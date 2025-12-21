#!/bin/bash

# Backup the file
cp "/Users/ericcoffie/Linkedin App/server.js" "/Users/ericcoffie/Linkedin App/server.js.backup-before-replacement"

# Extract everything before line 843 (the app.post line)
head -n 842 "/Users/ericcoffie/Linkedin App/server.js" > "/Users/ericcoffie/Linkedin App/server.js.new"

# Add the new endpoint (without the comment lines 1-3)
tail -n +4 "/Users/ericcoffie/Linkedin App/usaspending-endpoint.js" >> "/Users/ericcoffie/Linkedin App/server.js.new"

# Extract everything after line 1892 (after the old endpoint)
tail -n +1893 "/Users/ericcoffie/Linkedin App/server.js" >> "/Users/ericcoffie/Linkedin App/server.js.new"

# Replace the original
mv "/Users/ericcoffie/Linkedin App/server.js.new" "/Users/ericcoffie/Linkedin App/server.js"

echo "✅ Replacement complete!"
