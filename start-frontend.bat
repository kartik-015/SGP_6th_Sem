@echo off
setlocal

pushd "%~dp0frontend"
echo Installing frontend dependencies...
call npm install || goto :eof

echo Starting frontend dev server...
call npm run dev

popd
endlocal
