#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <commit_hash>"
  exit 1
fi

commit_hash="$1"

echo "<div class='changelog'>"

commit_dates=$(git log --format="%ad" --date=format:'%Y-%m-%d' "$commit_hash..HEAD" | sort -u -r)
commit_subject_regex=" [A-Za-z0-9]+(\([A-Za-z0-9]+\)): " # Regex pattern to match commit subjects

for date in $commit_dates; do
	echo "<div class='changelog-day'>"
	echo "<h2 style='margin-bottom: 0px;'>$date</h2>"
	echo "<ul style='padding: 0px 16px; outline: auto; list-style: none;'>"

	echo $(git log --pretty=format:"<li><span style='color: #1de9b6;'>%h</span> <span class='msg'>%s</span></li>" --date=format:'%Y-%m-%d' --since="$date 00:00" --until="$date 23:59" "$commit_hash..HEAD" | sed '/^$/d')

	echo "</ul>"
	echo "</div>"
done

echo "</div>"
