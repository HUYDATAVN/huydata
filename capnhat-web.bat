@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Cap nhat website HuyData (ban 1-file)

echo ==================================================
echo    CAP NHAT WEBSITE HUYDATA  (ban 1-file)
echo ==================================================
echo.
echo  Truoc khi chay file nay, hay chac chan da:
echo    1) Sua noi dung / viet bai trong bang quan tri
echo    2) Bam "Xuat trang (.html)"  -^>  tai ve Downloads
echo.

REM --- Tim file HuyData_Website*.html moi nhat trong Downloads ---
set "DL=%USERPROFILE%\Downloads"
set "SRC="
for /f "delims=" %%F in ('dir /b /a-d /o-d "%DL%\HuyData_Website*.html" 2^>nul') do (
    set "SRC=%DL%\%%F"
    goto :got
)
:got
if "%SRC%"=="" (
    echo [DUNG LAI] Khong tim thay HuyData_Website*.html trong Downloads.
    echo Hay vao bang quan tri, bam "Xuat trang (.html)" truoc da.
    echo.
    pause
    exit /b 1
)
echo  Dang dung file: %SRC%
copy /y "%SRC%" "index.html" >nul
if errorlevel 1 ( echo [LOI] Khong chep duoc file. & pause & exit /b 1 )
echo  Da cap nhat index.html.
echo.

REM --- Day len GitHub ---
git add index.html
git commit -m "Cap nhat noi dung"
git push

echo.
echo ==================================================
echo    HOAN TAT^!  Cho 1-2 phut roi mo:
echo        https://huydata.vn
echo    Nho nhan  Ctrl + F5  de thay noi dung moi.
echo ==================================================
echo.
pause
