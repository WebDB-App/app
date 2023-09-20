#!/bin/bash

# Check if a commit hash argument is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <commit_hash>"
  exit 1
fi

commit_hash="$1"

# Print the opening div tag
echo "<div class='changelog'>"

# Get the list of unique commit dates in reverse chronological order
commit_dates=$(git log --format="%ad" --date=format:'%Y-%m-%d' "$commit_hash..HEAD" | sort -u -r)

# Iterate through the commit dates and format the log entries as HTML
for date in $commit_dates; do
  echo "<div class='changelog-day'>"
  echo "<h2>$date</h2>"
  echo "<ul>"

  # Get commits for the current date and format them with color
  git log --pretty=format:"<li><span class='hash'>%h</strong> <span class='msg'>%s</span></li>" --date=format:'%Y-%m-%d' --since="$date 00:00" --until="$date 23:59" "$commit_hash..HEAD" | sed '/^$/d'

  echo "</ul>"
  echo "</div>"
done

# Print the closing div tag
echo "</div>"
