#!/bin/bash

generate_commit_message() {
	local new_message=$()
	echo "$new_message"
}

for commit_hash in $(git rev-list HEAD); do
	git checkout $commit_hash
	oco
	exit
	#git commit --amend -m "$new_message" --no-edit $commit_hash
done

#git push --force origin $BRANCH
