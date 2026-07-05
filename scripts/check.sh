#!/bin/bash
echo "check.sh : check pnpm install , lint, test , build"

pnpm run lint
if [ $? -ne 0 ];then
  echo "lint failed"
  exit 1
fi

echo "check.sh : fix lint "
npx prettier --write .
if [ $? -ne 0 ];then
  echo "fix lint failed"
  exit 1
fi


echo "check.sh : check type "
pnpm run check
if [ $? -ne 0 ];then
  echo "type check failed"
  exit 1
fi


echo "check.sh : check build "
pnpm run build
if [ $? -ne 0 ];then
  echo "build failed"
  exit 1
fi

echo -e "\n✅ 全部流程执行完成！"
