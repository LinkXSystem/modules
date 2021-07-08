#!/bin/bash

# 汇总命令：git branch | grep "_merge$" | xargs git branch -D
# 以下为脚本实现

branches=`git branch | grep "_merge$"`;

echo $branches;

for branch in $branches;
do
    echo "========================================";
    echo delete branch $branch;
    echo "========================================";

    git branch -d $branch;
done
