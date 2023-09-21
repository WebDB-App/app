#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <commit_hash>"
  exit 1
fi

commit_hash="$1"
git fetch origin $commit_hash
commit_dates=$(git log --format="%ad" --date=format:'%Y-%m-%d' "$commit_hash..HEAD" | sort -u -r)

echo "<div class='changelog'>"
for date in $commit_dates; do
	echo "<div class='changelog-day'>"
	echo "<h2 style='margin-bottom: 0px;'>$date</h2>"
	echo "<ul style='padding: 0px 16px; outline: auto; list-style: none;'>"

	echo $(git log --pretty=format:"<li><span style='color: #1de9b6;'>%h</span> <span class='msg'>%s</span></li>" --since="$date 00:00" --until="$date 23:59" | sed '/^$/d')

	echo "</ul>"
	echo "</div>"
done

echo "</div>"
